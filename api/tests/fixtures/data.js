const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// IDs para utilizar en pruebas (consistentes en todas las pruebas)
const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();
const chatOneId = new mongoose.Types.ObjectId();
const messageOneId = new mongoose.Types.ObjectId();

// Usuarios de prueba
const userOne = {
  _id: userOneId,
  name: "Usuario Prueba",
  email: "usuario.test@example.com",
  password: bcrypt.hashSync("Password123!", 10),
  pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
};

const userTwo = {
  _id: userTwoId,
  name: "Usuario Dos",
  email: "usuario.dos@example.com",
  password: bcrypt.hashSync("Password456!", 10),
  pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
};

// Chat de prueba
const chatOne = {
  _id: chatOneId,
  chatName: "Chat Individual",
  isGroupChat: false,
  users: [userOneId, userTwoId],
  latestMessage: null,
};

// Mensaje de prueba
const messageOne = {
  _id: messageOneId,
  sender: userOneId,
  content: "Mensaje de prueba",
  chat: chatOneId,
};

// Grupo de prueba
const groupChat = {
  _id: new mongoose.Types.ObjectId(),
  chatName: "Grupo de Prueba",
  isGroupChat: true,
  users: [userOneId, userTwoId, new mongoose.Types.ObjectId()],
  groupAdmin: userOneId,
  latestMessage: null,
};

module.exports = {
  userOneId,
  userTwoId,
  chatOneId,
  messageOneId,
  userOne,
  userTwo,
  chatOne,
  messageOne,
  groupChat,
};
