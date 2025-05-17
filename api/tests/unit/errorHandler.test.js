const httpMocks = require("node-mocks-http");
const errorHandler = require("../../middlewares/errorHandler");
const ApiResponse = require("../../utils/apiResponse");
const { StatusCodes } = require("http-status-codes");

describe("Middleware de Manejo de Errores", () => {
  let req, res, next;
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    req = httpMocks.createRequest({
      method: "GET",
      url: "/api/test",
    });
    res = httpMocks.createResponse();
    next = jest.fn();

    // Espiar console.error para pruebas
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env.NODE_ENV = originalEnv;
  });

  test("debe manejar errores con código de estado y mensaje", () => {
    const testError = new Error("Error de prueba");
    testError.statusCode = 400;

    errorHandler(testError, req, res, next);

    expect(res.statusCode).toBe(400);
    const responseData = JSON.parse(res._getData());
    expect(responseData).toEqual(
      expect.objectContaining({
        success: false,
        message: "Error de prueba",
        statusCode: 400,
        errors: expect.objectContaining({
          path: "/api/test",
          method: "GET",
          timestamp: expect.any(String),
          stack: expect.any(String),
        }),
      }),
    );
  });

  test("debe usar código 500 cuando no se proporciona", () => {
    const testError = new Error("Error interno");

    errorHandler(testError, req, res, next);

    expect(res.statusCode).toBe(500);
    const responseData = JSON.parse(res._getData());
    expect(responseData.message).toBe("Error interno");
    expect(responseData.statusCode).toBe(500);
  });

  test("debe usar mensaje predeterminado cuando no se proporciona", () => {
    const testError = new Error();
    testError.statusCode = 404;

    errorHandler(testError, req, res, next);

    expect(res.statusCode).toBe(404);
    const responseData = JSON.parse(res._getData());
    expect(responseData.message).toBe("Not Found");
    expect(responseData.statusCode).toBe(404);
  });

  test("debe ocultar el stack trace en producción", () => {
    process.env.NODE_ENV = "production";
    const testError = new Error("Error en producción");

    errorHandler(testError, req, res, next);

    const responseData = JSON.parse(res._getData());
    expect(responseData.errors.stack).toBeUndefined();
    expect(console.error).not.toHaveBeenCalled();
  });

  test("debe mostrar el stack trace en desarrollo", () => {
    process.env.NODE_ENV = "development";
    const testError = new Error("Error en desarrollo");

    errorHandler(testError, req, res, next);

    const responseData = JSON.parse(res._getData());
    expect(responseData.errors.stack).toBeDefined();
    expect(console.error).toHaveBeenCalled();
  });

  test("debe incluir información detallada sobre la petición", () => {
    req = httpMocks.createRequest({
      method: "POST",
      url: "/api/users",
      body: { test: "data" },
    });

    const testError = new Error("Error con datos de petición");
    errorHandler(testError, req, res, next);

    const responseData = JSON.parse(res._getData());
    expect(responseData.errors.path).toBe("/api/users");
    expect(responseData.errors.method).toBe("POST");
    expect(responseData.errors.timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    );
  });
});
