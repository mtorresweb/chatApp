const httpMocks = require("node-mocks-http");
const paginate = require("../../middlewares/paginate");

describe("Middleware de Paginación", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  test("debe aplicar valores predeterminados cuando no se proporcionan parámetros", () => {
    paginate(req, res, next);

    expect(req.pagination).toBeDefined();
    expect(req.pagination.page).toBe(1);
    expect(req.pagination.limit).toBe(10);
    expect(req.pagination.skip).toBe(0);
    expect(req.pagination.sort).toEqual({ createdAt: -1 });
    expect(next).toHaveBeenCalled();
  });

  test("debe utilizar los valores proporcionados por el usuario", () => {
    req.query = { page: "2", limit: "20", sort: "name", order: "asc" };

    paginate(req, res, next);

    expect(req.pagination.page).toBe(2);
    expect(req.pagination.limit).toBe(20);
    expect(req.pagination.skip).toBe(20);
    expect(req.pagination.sort).toEqual({ name: 1 });
    expect(next).toHaveBeenCalled();
  });

  test("debe manejar valores no numéricos", () => {
    req.query = { page: "invalid", limit: "invalid" };

    paginate(req, res, next);

    expect(req.pagination.page).toBe(1);
    expect(req.pagination.limit).toBe(10);
    expect(req.pagination.skip).toBe(0);
    expect(next).toHaveBeenCalled();
  });

  test("debe aplicar restricciones a valores mínimos", () => {
    req.query = { page: "0", limit: "0" };

    paginate(req, res, next);

    expect(req.pagination.page).toBe(1);
    expect(req.pagination.limit).toBe(10);
    expect(req.pagination.skip).toBe(0);
    expect(next).toHaveBeenCalled();
  });

  test("debe aplicar restricciones a valores máximos", () => {
    req.query = { limit: "200" }; // Mayor que el máximo permitido (100)

    paginate(req, res, next);

    expect(req.pagination.limit).toBe(10); // Debería usar el valor predeterminado
    expect(next).toHaveBeenCalled();
  });

  test("debe calcular correctamente el skip para paginación", () => {
    req.query = { page: "3", limit: "15" };

    paginate(req, res, next);

    // Skip = (page - 1) * limit = (3 - 1) * 15 = 30
    expect(req.pagination.skip).toBe(30);
    expect(next).toHaveBeenCalled();
  });
});
