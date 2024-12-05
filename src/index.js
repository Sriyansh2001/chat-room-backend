const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { EVENT_TYPE } = require("./constant/socket.constants");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const users = {};

io.on(EVENT_TYPE.connection, (socket) => {
  const username = socket?.handshake?.auth?.username;
  const messageId = socket?.handshake?.auth?.messageId;
  console.log("user connected: ", username, messageId);
  socket.broadcast.emit(EVENT_TYPE.newUserConnected, {
    username: username ?? "guest",
  });

  socket.on(EVENT_TYPE.chatMessage, (messageDetail) => {
    console.log("get message: ", messageDetail);
    io.emit(EVENT_TYPE.chatMessage, { ...messageDetail, username, messageId });
  });

  // on disconnection action
  socket.on(EVENT_TYPE.disconnect, () => {
    console.log("user disconnected");
    delete users[socket.id];
  });
});

server.listen(9000, () => {
  console.log("listening at port 9000");
});
