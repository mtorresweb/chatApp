const app = require("./app");
const { Server } = require("socket.io");
const connection = require("./database/connection.js");
require("express-async-errors");

const PORT = process.env.PORT;

//Connection to database
connection();

const server = app.listen(PORT);
console.log("app listening on port " + PORT);

//sockets server
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

  socket.on("leave group", (room, user) => {
    socket.to(room._id).emit("left group", room._id, user);
    socket.leave(room._id);
  });

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    socket.to(chat._id).emit("message received", newMessageReceived);
  });

  socket.on("typing", (room) => socket.to(room).emit("typing"));

  socket.on("stop typing", (room) => socket.to(room).emit("stop typing"));

  socket.on("removed from group", (data) => {
    socket.to(data.room).emit("removed from group", data.userId, data.room);
  });

  socket.on("added to group", (updatedChat, userToAdd) => {
    socket
      .to([updatedChat._id, userToAdd._id])
      .emit("added to group", updatedChat, userToAdd);
  });
});
