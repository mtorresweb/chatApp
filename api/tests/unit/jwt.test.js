const jwt = require("jsonwebtoken");
const jwtHelper = require("../../helpers/jwt");

// Mock de jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("test-token"),
  verify: jest.fn(),
}));

describe("JWT Helper", () => {
  const testPayload = { id: 1, name: "Test User" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateAccessToken", () => {
    test("debe generar un token de acceso", () => {
      const token = jwtHelper.generateAccessToken(testPayload);

      expect(jwt.sign).toHaveBeenCalledWith(
        testPayload,
        jwtHelper.secretKey,
        expect.objectContaining({
          expiresIn: "24h",
          issuer: "chat-app-api",
          audience: "chat-app-client",
        }),
      );
      expect(token).toBe("test-token");
    });

    test("debe generar un token con expiración personalizada", () => {
      const expiryTime = "1h";
      const token = jwtHelper.generateAccessToken(testPayload, expiryTime);

      expect(jwt.sign).toHaveBeenCalledWith(
        testPayload,
        jwtHelper.secretKey,
        expect.objectContaining({
          expiresIn: expiryTime,
          issuer: "chat-app-api",
          audience: "chat-app-client",
        }),
      );
      expect(token).toBe("test-token");
    });
  });

  describe("generateRefreshToken", () => {
    test("debe generar un token de refresco", () => {
      const token = jwtHelper.generateRefreshToken(testPayload);

      expect(jwt.sign).toHaveBeenCalledWith(
        testPayload,
        jwtHelper.refreshKey,
        expect.objectContaining({
          expiresIn: "30d",
          issuer: "chat-app-api",
          audience: "chat-app-client",
        }),
      );
      expect(token).toBe("test-token");
    });
  });

  describe("verifyToken", () => {
    test("debe verificar un token válido", () => {
      jwt.verify.mockReturnValueOnce(testPayload);

      const result = jwtHelper.verifyToken("valid-token");

      expect(jwt.verify).toHaveBeenCalledWith(
        "valid-token",
        jwtHelper.secretKey,
      );
      expect(result).toEqual(testPayload);
    });

    test("debe lanzar un error si el token es inválido", () => {
      jwt.verify.mockImplementationOnce(() => {
        throw new Error("Token inválido");
      });

      expect(() => {
        jwtHelper.verifyToken("invalid-token");
      }).toThrow("Token inválido o expirado");
    });
  });

  describe("verifyRefreshToken", () => {
    test("debe verificar un token de refresco válido", () => {
      jwt.verify.mockReturnValueOnce(testPayload);

      const result = jwtHelper.verifyRefreshToken("valid-refresh-token");

      expect(jwt.verify).toHaveBeenCalledWith(
        "valid-refresh-token",
        jwtHelper.refreshKey,
      );
      expect(result).toEqual(testPayload);
    });

    test("debe lanzar un error si el token de refresco es inválido", () => {
      jwt.verify.mockImplementationOnce(() => {
        throw new Error("Token inválido");
      });

      expect(() => {
        jwtHelper.verifyRefreshToken("invalid-refresh-token");
      }).toThrow("Token de refresco inválido o expirado");
    });
  });
});
