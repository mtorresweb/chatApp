const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const User = require("../../models/User");
const Chat = require("../../models/Chat");
const {
  connectDB,
  closeDB,
  clearDB,
  generateTestTokens,
} = require("../fixtures/db");
const { userOne, userTwo, chatOne, groupChat } = require("../fixtures/data");

// Configuración de la base de datos antes de las pruebas
beforeAll(async () => {
  await connectDB();
});

// Limpiar la base de datos antes de cada prueba
beforeEach(async () => {
  await clearDB();
  await User.create(userOne);
  await User.create(userTwo);
  await Chat.create(chatOne);
});

// Cerrar la conexión después de todas las pruebas
afterAll(async () => {
  await closeDB();
});

describe("API de Chats", () => {
  describe("POST /api/chat/access", () => {
    test("debe acceder a un chat existente", async () => {
      const { accessToken } = generateTestTokens(userOne);

      const response = await request(app)
        .post("/api/chat/access")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ userId: userTwo._id.toString() })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data).toHaveProperty("users");
      expect(response.body.data.users.length).toBe(2);
    });

    test("debe crear un nuevo chat si no existe", async () => {
      const { accessToken } = generateTestTokens(userOne);

      // Eliminar el chat existente para forzar la creación de uno nuevo
      await Chat.deleteMany({});

      const response = await request(app)
        .post("/api/chat/access")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ userId: userTwo._id.toString() })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data).toHaveProperty("users");
      expect(response.body.data.users.length).toBe(2);

      // Verificar que el chat se creó en la base de datos
      const chatCount = await Chat.countDocuments();
      expect(chatCount).toBe(1);
    });

    test("debe rechazar petición sin ID de usuario", async () => {
      const { accessToken } = generateTestTokens(userOne);

      await request(app)
        .post("/api/chat/access")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({})
        .expect(400);
    });
  });

  describe("GET /api/chat/getChats", () => {
    test("debe obtener todos los chats del usuario", async () => {
      const { accessToken } = generateTestTokens(userOne);

      const response = await request(app)
        .get("/api/chat/getChats")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test("debe devolver array vacío si el usuario no tiene chats", async () => {
      // Crear un usuario nuevo sin chats
      const newUser = {
        _id: new mongoose.Types.ObjectId(),
        name: "Usuario Sin Chats",
        email: "sinchats@example.com",
        password: "Password123!",
        pic: "https://example.com/pic.jpg",
      };

      await User.create(newUser);
      const { accessToken } = generateTestTokens(newUser);

      const response = await request(app)
        .get("/api/chat/getChats")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(0);
    });
  });

  describe("POST /api/chat/createGroup", () => {
    test("debe crear un nuevo chat grupal", async () => {
      const { accessToken } = generateTestTokens(userOne);

      const groupData = {
        name: "Grupo Test",
        users: [userTwo._id.toString()],
      };

      const response = await request(app)
        .post("/api/chat/createGroup")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(groupData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data).toHaveProperty("chatName", groupData.name);
      expect(response.body.data).toHaveProperty("isGroupChat", true);
      expect(response.body.data).toHaveProperty("users");
      expect(response.body.data.users.length).toBeGreaterThanOrEqual(2);
      expect(response.body.data).toHaveProperty("groupAdmin");

      // Verificar que el grupo se creó en la base de datos
      const createdGroup = await Chat.findById(response.body.data._id);
      expect(createdGroup).toBeTruthy();
      expect(createdGroup.isGroupChat).toBe(true);
    });

    test("debe rechazar creación de grupo con menos de 3 participantes", async () => {
      const { accessToken } = generateTestTokens(userOne);

      const invalidGroupData = {
        name: "Grupo Inválido",
        users: [], // No incluye usuarios adicionales
      };

      await request(app)
        .post("/api/chat/createGroup")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(invalidGroupData)
        .expect(400);
    });
  });

  describe("PUT /api/chat/renameGroup", () => {
    test("debe renombrar un chat grupal", async () => {
      // Crear un grupo primero
      await Chat.create(groupChat);
      const { accessToken } = generateTestTokens(userOne);

      const updateData = {
        chatId: groupChat._id.toString(),
        chatName: "Nuevo Nombre del Grupo",
      };

      const response = await request(app)
        .put("/api/chat/renameGroup")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty(
        "_id",
        groupChat._id.toString(),
      );
      expect(response.body.data).toHaveProperty(
        "chatName",
        updateData.chatName,
      );

      // Verificar actualización en la base de datos
      const updatedChat = await Chat.findById(groupChat._id);
      expect(updatedChat.chatName).toBe(updateData.chatName);
    });
  });
});
