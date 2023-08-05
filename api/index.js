const app = require("./app");
const { Server } = require("socket.io");
const connection = require("./database/connection.js");
require("express-async-errors");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT;

//Connection to database
connection();

const server = app.listen(PORT);
console.log("app listening on port " + PORT);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    socket.to(chat._id).emit("message received", newMessageReceived);
  });

  socket.on("typing", (room) => socket.to(room).emit("typing"));

  socket.on("stop typing", (room) => socket.to(room).emit("stop typing"));

  socket.on("createChat", (chat) => {
    io.emit("createChat", chat);
  });

  socket.off("setup", (userData) => {
    socket.leave(userData._id);
  });
});
