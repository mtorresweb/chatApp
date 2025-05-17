const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const User = require("../../models/User");
const {
  connectDB,
  closeDB,
  clearDB,
  generateTestTokens,
} = require("../fixtures/db");
const { userOne, userTwo } = require("../fixtures/data");

// Configuración de la conexión a la base de datos antes de las pruebas
beforeAll(async () => {
  await connectDB();
});

// Limpiar la base de datos antes de cada prueba
beforeEach(async () => {
  await clearDB();
  await User.create(userOne);
  await User.create(userTwo);
});

// Cerrar la conexión después de todas las pruebas
afterAll(async () => {
  await closeDB();
});

describe("API de Usuarios", () => {
  describe("POST /api/user/register", () => {
    test("debe registrar un nuevo usuario", async () => {
      const newUser = {
        name: "Usuario Nuevo",
        email: "nuevo@example.com",
        password: "Password123!",
      };

      const response = await request(app)
        .post("/api/user/register")
        .send(newUser)
        .expect(201);

      // Verificación de respuesta
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty("_id");
      expect(response.body.data.user).toHaveProperty("name", newUser.name);
      expect(response.body.data.user).toHaveProperty("email", newUser.email);
      expect(response.body.data.user).not.toHaveProperty("password");
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");

      // Verificación en la base de datos
      const createdUser = await User.findOne({ email: newUser.email });
      expect(createdUser).toBeTruthy();
      expect(createdUser.name).toBe(newUser.name);
    });

    test("debe rechazar registro con email duplicado", async () => {
      const duplicateUser = {
        name: "Duplicado",
        email: userOne.email, // Email que ya existe
        password: "Password123!",
      };

      const response = await request(app)
        .post("/api/user/register")
        .send(duplicateUser)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain(
        "correo electrónico ya está en uso",
      );
    });

    test("debe rechazar registro con datos inválidos", async () => {
      const invalidUser = {
        name: "Inválido",
        email: "emailinvalido",
        password: "123",
      };

      await request(app)
        .post("/api/user/register")
        .send(invalidUser)
        .expect(400);
    });
  });

  describe("POST /api/user/login", () => {
    test("debe autenticar y devolver token para credenciales válidas", async () => {
      const response = await request(app)
        .post("/api/user/login")
        .send({
          email: userOne.email,
          password: "Password123!",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty("_id");
      expect(response.body.data.user).toHaveProperty("email", userOne.email);
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
    });

    test("debe rechazar credenciales inválidas", async () => {
      const response = await request(app)
        .post("/api/user/login")
        .send({
          email: userOne.email,
          password: "contraseña-incorrecta",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain(
        "Correo electrónico o contraseña incorrectos",
      );
    });
  });

  describe("GET /api/user", () => {
    test("debe listar usuarios con búsqueda", async () => {
      const { accessToken } = generateTestTokens(userOne);

      const response = await request(app)
        .get("/api/user?search=Usuario")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty("name");
      expect(response.body.data[0]).toHaveProperty("email");
      expect(response.body.data[0]).not.toHaveProperty("password");
    });

    test("debe rechazar petición sin autenticación", async () => {
      await request(app).get("/api/user?search=Usuario").expect(401);
    });
  });

  describe("POST /api/user/refresh-token", () => {
    test("debe renovar el token de acceso", async () => {
      const { accessToken } = generateTestTokens(userOne);

      const response = await request(app)
        .post("/api/user/refresh-token")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("accessToken");
    });

    test("debe rechazar petición sin token", async () => {
      await request(app).post("/api/user/refresh-token").expect(401);
    });
  });
});
