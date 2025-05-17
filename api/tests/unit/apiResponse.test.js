const ApiResponse = require("../../utils/apiResponse");

describe("ApiResponse", () => {
  describe("success", () => {
    test("debe crear una respuesta de éxito con los valores predeterminados", () => {
      const response = ApiResponse.success();

      expect(response).toHaveProperty("success", true);
      expect(response).toHaveProperty("statusCode", 200);
      expect(response).toHaveProperty("message", "Operación exitosa");
      expect(response).toHaveProperty("data", null);
      expect(response).toHaveProperty("timestamp");
    });

    test("debe crear una respuesta de éxito con valores personalizados", () => {
      const data = { id: 1, name: "test" };
      const message = "Creado con éxito";
      const statusCode = 201;

      const response = ApiResponse.success(data, message, statusCode);

      expect(response).toHaveProperty("success", true);
      expect(response).toHaveProperty("statusCode", statusCode);
      expect(response).toHaveProperty("message", message);
      expect(response).toHaveProperty("data", data);
      expect(response).toHaveProperty("timestamp");
    });
  });

  describe("error", () => {
    test("debe crear una respuesta de error con los valores predeterminados", () => {
      const response = ApiResponse.error();

      expect(response).toHaveProperty("success", false);
      expect(response).toHaveProperty("statusCode", 400);
      expect(response).toHaveProperty("message", "Ha ocurrido un error");
      expect(response).toHaveProperty("errors", null);
      expect(response).toHaveProperty("timestamp");
    });

    test("debe crear una respuesta de error con valores personalizados", () => {
      const message = "Datos inválidos";
      const statusCode = 422;
      const errors = [{ field: "email", message: "Email inválido" }];

      const response = ApiResponse.error(message, statusCode, errors);

      expect(response).toHaveProperty("success", false);
      expect(response).toHaveProperty("statusCode", statusCode);
      expect(response).toHaveProperty("message", message);
      expect(response).toHaveProperty("errors", errors);
      expect(response).toHaveProperty("timestamp");
    });
  });

  describe("paginated", () => {
    test("debe crear una respuesta paginada con los valores predeterminados", () => {
      const data = [{ id: 1 }, { id: 2 }];
      const pagination = { page: 1, limit: 10, total: 2 };

      const response = ApiResponse.paginated(data, pagination);

      expect(response).toHaveProperty("success", true);
      expect(response).toHaveProperty("statusCode", 200);
      expect(response).toHaveProperty("message", "Datos recuperados con éxito");
      expect(response).toHaveProperty("data", data);
      expect(response).toHaveProperty("pagination", pagination);
      expect(response).toHaveProperty("timestamp");
    });

    test("debe crear una respuesta paginada con mensaje personalizado", () => {
      const data = [{ id: 1 }, { id: 2 }];
      const pagination = { page: 1, limit: 10, total: 2 };
      const message = "Usuarios recuperados con éxito";

      const response = ApiResponse.paginated(data, pagination, message);

      expect(response).toHaveProperty("success", true);
      expect(response).toHaveProperty("statusCode", 200);
      expect(response).toHaveProperty("message", message);
      expect(response).toHaveProperty("data", data);
      expect(response).toHaveProperty("pagination", pagination);
      expect(response).toHaveProperty("timestamp");
    });
  });
});
