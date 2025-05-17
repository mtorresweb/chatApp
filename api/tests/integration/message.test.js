const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const User = require("../../models/User");
const Chat = require("../../models/Chat");
const Message = require("../../models/Message");
const {
  connectDB,
  closeDB,
  clearDB,
  generateTestTokens,
} = require("../fixtures/db");
const { userOne, userTwo, chatOne, messageOne } = require("../fixtures/data");

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
  await Message.create(messageOne);
});

// Cerrar la conexión después de todas las pruebas
afterAll(async () => {
  await closeDB();
});

describe("API de Mensajes", () => {
  describe("POST /api/message/send", () => {
    test("debe enviar un mensaje correctamente", async () => {
      const { accessToken } = generateTestTokens(userOne);

      const messageData = {
        content: "Este es un mensaje de prueba",
        chatId: chatOne._id.toString(),
      };

      const response = await request(app)
        .post("/api/message/send")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(messageData)
        .expect(200);

      // Verificar estructura del mensaje devuelto
      expect(response.body).toHaveProperty("_id");
      expect(response.body).toHaveProperty("content", messageData.content);
      expect(response.body).toHaveProperty("sender");
      expect(response.body).toHaveProperty("chat");

      // Verificar que el mensaje se guardó en la base de datos
      const savedMessage = await Message.findById(response.body._id);
      expect(savedMessage).toBeTruthy();
      expect(savedMessage.content).toBe(messageData.content);

      // Verificar que el chat se actualizó con el último mensaje
      const updatedChat = await Chat.findById(chatOne._id);
      expect(updatedChat.latestMessage.toString()).toBe(response.body._id);
    });

    test("debe rechazar el envío de mensaje sin contenido", async () => {
      const { accessToken } = generateTestTokens(userOne);

      const invalidMessageData = {
        chatId: chatOne._id.toString(),
        // Sin campo content
      };

      await request(app)
        .post("/api/message/send")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(invalidMessageData)
        .expect(400);
    });

    test("debe rechazar el envío de mensaje sin chatId", async () => {
      const { accessToken } = generateTestTokens(userOne);

      const invalidMessageData = {
        content: "Mensaje sin chat ID",
        // Sin campo chatId
      };

      await request(app)
        .post("/api/message/send")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(invalidMessageData)
        .expect(400);
    });

    test("debe rechazar envío de mensaje a un chat que no existe", async () => {
      const { accessToken } = generateTestTokens(userOne);

      const nonExistentChatId = new mongoose.Types.ObjectId();
      const messageData = {
        content: "Mensaje para chat inexistente",
        chatId: nonExistentChatId.toString(),
      };

      await request(app)
        .post("/api/message/send")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(messageData)
        .expect(404);
    });

    test("debe rechazar envío de mensaje de un usuario no autenticado", async () => {
      const messageData = {
        content: "Mensaje sin autenticación",
        chatId: chatOne._id.toString(),
      };

      await request(app)
        .post("/api/message/send")
        .send(messageData)
        .expect(401);
    });
  });

  describe("GET /api/message/getMessages/:chatId", () => {
    test("debe obtener mensajes de un chat", async () => {
      const { accessToken } = generateTestTokens(userOne);

      const response = await request(app)
        .get(`/api/message/getMessages/${chatOne._id.toString()}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("_id");
      expect(response.body[0]).toHaveProperty("content");
      expect(response.body[0]).toHaveProperty("sender");
      expect(response.body[0].sender).toHaveProperty("name");
      expect(response.body[0].sender).toHaveProperty("pic");
    });

    test("debe devolver un array vacío si no hay mensajes en el chat", async () => {
      // Crear un nuevo chat sin mensajes
      const newChat = {
        _id: new mongoose.Types.ObjectId(),
        chatName: "Chat sin mensajes",
        isGroupChat: false,
        users: [userOne._id, userTwo._id],
        latestMessage: null,
      };

      await Chat.create(newChat);
      const { accessToken } = generateTestTokens(userOne);

      const response = await request(app)
        .get(`/api/message/getMessages/${newChat._id.toString()}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    test("debe rechazar petición para un chat que no existe", async () => {
      const { accessToken } = generateTestTokens(userOne);
      const nonExistentChatId = new mongoose.Types.ObjectId();

      await request(app)
        .get(`/api/message/getMessages/${nonExistentChatId.toString()}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(404);
    });

    test("debe rechazar petición de un usuario no autenticado", async () => {
      await request(app)
        .get(`/api/message/getMessages/${chatOne._id.toString()}`)
        .expect(401);
    });

    test("debe rechazar petición con un ID de chat inválido", async () => {
      const { accessToken } = generateTestTokens(userOne);

      await request(app)
        .get("/api/message/getMessages/invalid-id")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(400);
    });
  });
});
