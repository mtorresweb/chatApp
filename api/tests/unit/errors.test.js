const {
  ApiError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  TooManyRequestsError,
  InternalServerError,
} = require("../../utils/errors");

describe("Errors", () => {
  describe("ApiError", () => {
    test("debe crear un error base con mensaje y código de estado", () => {
      const message = "Error de prueba";
      const statusCode = 400;
      const error = new ApiError(message, statusCode);

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error.name).toBe("ApiError");
    });

    test("debe tener código 500 por defecto", () => {
      const error = new ApiError("Error interno");

      expect(error.statusCode).toBe(500);
    });
  });

  describe("NotFoundError", () => {
    test("debe crear un error con mensaje personalizado cuando se proporciona ID", () => {
      const resource = "usuario";
      const id = "123";
      const error = new NotFoundError(resource, id);

      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe(
        "El recurso usuario con id 123 no fue encontrado",
      );
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe("NotFoundError");
    });

    test("debe crear un error genérico cuando no se proporciona ID", () => {
      const error = new NotFoundError("ruta");

      expect(error.message).toBe("La ruta solicitada no fue encontrada");
      expect(error.statusCode).toBe(404);
    });
  });

  describe("BadRequestError", () => {
    test("debe crear un error de solicitud inválida con mensaje personalizado", () => {
      const message = "Datos de entrada inválidos";
      const error = new BadRequestError(message);

      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe("BadRequestError");
    });

    test("debe usar mensaje predeterminado si no se proporciona uno", () => {
      const error = new BadRequestError();

      expect(error.message).toBe("Solicitud inválida");
      expect(error.statusCode).toBe(400);
    });
  });

  describe("OtherErrors", () => {
    test("debe crear un error de autenticación", () => {
      const error = new UnauthorizedError("No autenticado");

      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe("No autenticado");
      expect(error.statusCode).toBe(401);
    });

    test("debe crear un error de autorización", () => {
      const error = new ForbiddenError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(403);
    });

    test("debe crear un error de conflicto", () => {
      const error = new ConflictError("El correo ya existe");

      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe("El correo ya existe");
      expect(error.statusCode).toBe(409);
    });

    test("debe crear un error de demasiadas solicitudes", () => {
      const error = new TooManyRequestsError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(429);
    });

    test("debe crear un error interno del servidor", () => {
      const error = new InternalServerError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(500);
    });
  });
});
