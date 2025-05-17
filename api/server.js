const app = require("./app.js");
const { Server } = require("socket.io");
const connection = require("./database/connection.js");
require("express-async-errors");

process
  .on("SIGTERM", shutdown("SIGTERM"))
  .on("SIGINT", shutdown("SIGINT"))
  .on("uncaughtException", shutdown("uncaughtException"));

function shutdown(signal) {
  return (err) => {
    console.log(`${signal}...`);
    if (err) console.error(err.stack || err);
    setTimeout(() => {
      console.log("...waited 5s, exiting.");
      process.exit(err ? 1 : 0);
    }, 5000).unref();
  };
}

const PORT = process.env.PORT || 3000;

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
  // Add error handling for socket.io
  io.engine.on("connection_error", (err) => {
    console.log("Socket.io connection error:", err);
  });

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

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log(`Socket ${socket.id} disconnected due to ${reason}`);
  });
});
