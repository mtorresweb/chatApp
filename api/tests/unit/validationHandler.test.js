const httpMocks = require("node-mocks-http");
const { body } = require("express-validator");
const validateResults = require("../../middlewares/validationHandler");
const ApiResponse = require("../../utils/apiResponse");

describe("Middleware de Validación", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Función auxiliar para aplicar reglas de validación
  const applyValidation = async (request, rules) => {
    for (const rule of rules) {
      await rule(request, {}, () => {});
    }
    return validateResults(request, res, next);
  };

  test("debe llamar a next() cuando no hay errores de validación", async () => {
    req.body = { name: "Usuario Prueba", email: "test@example.com" };
    const rules = [
      body("name").exists().isLength({ min: 3 }),
      body("email").isEmail(),
    ];

    await applyValidation(req, rules);

    expect(next).toHaveBeenCalled();
  });

  test("debe devolver errores de validación cuando hay campos inválidos", async () => {
    req.body = { name: "A", email: "invalid-email" };
    const rules = [
      body("name")
        .exists()
        .isLength({ min: 3 })
        .withMessage("Nombre demasiado corto"),
      body("email").isEmail().withMessage("Email inválido"),
    ];

    await applyValidation(req, rules);

    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        success: false,
        message: "Error de validación de datos",
        statusCode: 400,
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: "name",
            message: "Nombre demasiado corto",
          }),
          expect.objectContaining({
            field: "email",
            message: "Email inválido",
          }),
        ]),
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("debe validar campos opcionales cuando están presentes", async () => {
    req.body = { age: "not-a-number" };
    const rules = [
      body("age")
        .optional()
        .isNumeric()
        .withMessage("La edad debe ser un número"),
    ];

    await applyValidation(req, rules);

    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res._getData()).errors[0].field).toBe("age");
    expect(next).not.toHaveBeenCalled();
  });

  test("debe permitir campos opcionales cuando no están presentes", async () => {
    req.body = {}; // Sin el campo opcional
    const rules = [body("age").optional().isNumeric()];

    await applyValidation(req, rules);

    expect(next).toHaveBeenCalled();
  });

  test("debe soportar validación de múltiples campos", async () => {
    req.body = {
      username: "user1",
      password: "123",
      confirmPassword: "456",
    };

    const rules = [
      body("username").exists(),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Contraseña demasiado corta"),
      body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Las contraseñas no coinciden");
        }
        return true;
      }),
    ];

    await applyValidation(req, rules);

    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res._getData()).errors).toHaveLength(2); // Password corta y no coincidente
    expect(next).not.toHaveBeenCalled();
  });
});
