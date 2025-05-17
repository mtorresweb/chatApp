const httpMocks = require("node-mocks-http");
const jwt = require("jsonwebtoken");
const { auth, hasRole } = require("../../middlewares/auth");
const ApiResponse = require("../../utils/apiResponse");
const { generateAccessToken } = require("../../helpers/jwt");

// Mock para el módulo jwt
jest.mock("../../helpers/jwt", () => ({
  verifyToken: jest.fn(),
  generateAccessToken: jest.fn(),
}));

describe("Middleware de Autenticación", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  describe("auth middleware", () => {
    test("debe rechazar solicitud sin encabezado de autorización", () => {
      auth(req, res, next);

      expect(res.statusCode).toBe(401);
      const response = JSON.parse(res._getData());
      expect(response).toEqual(
        expect.objectContaining({
          success: false,
          message: "Se requiere un token de autenticación",
          statusCode: 401,
          errors: null,
        }),
      );
      expect(response).toHaveProperty("timestamp");
      expect(next).not.toHaveBeenCalled();
    });

    test("debe rechazar solicitud con formato de token inválido", () => {
      req.headers.authorization = "InvalidFormat";

      auth(req, res, next);

      expect(res.statusCode).toBe(401);
      const response = JSON.parse(res._getData());
      expect(response).toEqual(
        expect.objectContaining({
          success: false,
          message: "Se requiere un token de autenticación",
          statusCode: 401,
          errors: null,
        }),
      );
      expect(response).toHaveProperty("timestamp");
      expect(next).not.toHaveBeenCalled();
    });

    test("debe rechazar token inválido", () => {
      req.headers.authorization = "Bearer invalidtoken";
      require("../../helpers/jwt").verifyToken.mockImplementation(() => {
        throw new Error("Token inválido");
      });

      auth(req, res, next);

      expect(res.statusCode).toBe(401);
      const response = JSON.parse(res._getData());
      expect(response).toEqual(
        expect.objectContaining({
          success: false,
          message: "Token inválido o expirado",
          statusCode: 401,
          errors: null,
        }),
      );
      expect(response).toHaveProperty("timestamp");
      expect(next).not.toHaveBeenCalled();
    });

    test("debe permitir solicitud con token válido", () => {
      const user = { _id: "123", name: "Test User", email: "test@example.com" };
      req.headers.authorization = "Bearer validtoken";
      require("../../helpers/jwt").verifyToken.mockReturnValue(user);

      auth(req, res, next);

      expect(req.user).toEqual(user);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("hasRole middleware", () => {
    test("debe rechazar solicitud sin autenticación previa", () => {
      const checkRole = hasRole(["admin"]);
      checkRole(req, res, next);

      expect(res.statusCode).toBe(401);
      const response = JSON.parse(res._getData());
      expect(response).toEqual(
        expect.objectContaining({
          success: false,
          message: "No autenticado",
          statusCode: 401,
          errors: null,
        }),
      );
      expect(response).toHaveProperty("timestamp");
      expect(next).not.toHaveBeenCalled();
    });

    test("debe rechazar solicitud de usuario sin rol requerido", () => {
      const checkRole = hasRole(["admin"]);
      req.user = { _id: "123", name: "Test User", role: "user" };

      checkRole(req, res, next);

      expect(res.statusCode).toBe(403);
      const response = JSON.parse(res._getData());
      expect(response).toEqual(
        expect.objectContaining({
          success: false,
          message: "No tienes permiso para acceder a este recurso",
          statusCode: 403,
          errors: null,
        }),
      );
      expect(response).toHaveProperty("timestamp");
      expect(next).not.toHaveBeenCalled();
    });

    test("debe permitir solicitud de usuario con rol requerido", () => {
      const checkRole = hasRole(["admin"]);
      req.user = { _id: "123", name: "Test User", role: "admin" };

      checkRole(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test("debe permitir solicitud sin verificación de roles (array vacío)", () => {
      const checkRole = hasRole([]);
      req.user = { _id: "123", name: "Test User", role: "user" };

      checkRole(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
