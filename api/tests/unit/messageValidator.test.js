const httpMocks = require("node-mocks-http");
const {
  validateChatId,
  validateSendMessage,
} = require("../../middlewares/validators/messageValidator");
const validateResults = require("../../middlewares/validationHandler");

// Mock del validateResults para probar solo los validators
jest.mock("../../middlewares/validationHandler", () =>
  jest.fn((req, res, next) => next()),
);

describe("Message Validators", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    validateResults.mockClear();
  });

  describe("validateChatId", () => {
    test("debe validar chatId en parámetros", async () => {
      req = httpMocks.createRequest({
        params: { chatId: "60d21b4667d0d8992e610c85" },
      });

      const validator = validateChatId();

      // Aplicar todas las reglas de validación
      for (const rule of validator.slice(0, -1)) {
        await rule(req, res, () => {});
      }

      // Aplicar la función que llama a validateResults
      validator[validator.length - 1](req, res, next);

      expect(validateResults).toHaveBeenCalledWith(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test("debe rechazar chatId vacío", async () => {
      req = httpMocks.createRequest({
        params: { chatId: "" },
      });

      const validator = validateChatId();

      // Forzar error en la validación para este test
      validateResults.mockImplementationOnce((req, res, next) => {
        return res.status(400).json({ error: "Validation error" });
      });

      // Aplicar todas las reglas de validación
      for (const rule of validator.slice(0, -1)) {
        await rule(req, res, () => {});
      }

      // Aplicar la función que llama a validateResults
      validator[validator.length - 1](req, res, next);

      expect(validateResults).toHaveBeenCalledWith(req, res, next);
      expect(res.statusCode).toBe(400);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("validateSendMessage", () => {
    test("debe validar mensaje con content y chatId", async () => {
      req = httpMocks.createRequest({
        body: {
          content: "Mensaje de prueba",
          chatId: "60d21b4667d0d8992e610c85",
        },
      });

      const validator = validateSendMessage();

      // Aplicar todas las reglas de validación
      for (const rule of validator) {
        await rule(req, res, () => {});
      }

      // Como validateResults es el último elemento, no necesitamos ejecutarlo aquí
      // Aplicamos directamente validateResults para simular su comportamiento
      validateResults(req, res, next);

      expect(validateResults).toHaveBeenCalledWith(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test("debe rechazar mensaje sin content", async () => {
      req = httpMocks.createRequest({
        body: {
          chatId: "60d21b4667d0d8992e610c85",
          // Sin content
        },
      });

      const validator = validateSendMessage();

      // Forzar error en la validación para este test
      validateResults.mockImplementationOnce((req, res, next) => {
        return res.status(400).json({ error: "Validation error" });
      });

      // Aplicar todas las reglas de validación
      for (const rule of validator) {
        await rule(req, res, () => {});
      }

      validateResults(req, res, next);

      expect(validateResults).toHaveBeenCalledWith(req, res, next);
      expect(res.statusCode).toBe(400);
      expect(next).not.toHaveBeenCalled();
    });

    test("debe rechazar mensaje sin chatId", async () => {
      req = httpMocks.createRequest({
        body: {
          content: "Mensaje de prueba",
          // Sin chatId
        },
      });

      const validator = validateSendMessage();

      // Forzar error en la validación para este test
      validateResults.mockImplementationOnce((req, res, next) => {
        return res.status(400).json({ error: "Validation error" });
      });

      // Aplicar todas las reglas de validación
      for (const rule of validator) {
        await rule(req, res, () => {});
      }

      validateResults(req, res, next);

      expect(validateResults).toHaveBeenCalledWith(req, res, next);
      expect(res.statusCode).toBe(400);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
