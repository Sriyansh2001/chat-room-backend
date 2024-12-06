const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { EVENT_TYPE } = require("./constant/socket.constants");
const { getRandomDarkColor } = require("./utils/colorUtils");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let message = [];
let connectedUserList = {};

io.on(EVENT_TYPE.connection, (socket) => {
  const username = socket?.handshake?.auth?.username;
  const messageId = socket?.handshake?.auth?.messageId;

  connectedUserList[messageId] = {
    username,
    color: getRandomDarkColor(),
  };

  socket.broadcast.emit(EVENT_TYPE.newUserConnected, {
    username: username ?? "guest",
  });
  socket.broadcast.emit(EVENT_TYPE.connectedUserList, {
    connectedUserList,
  });
  socket.emit(EVENT_TYPE.connectedUserList, {
    connectedUserList,
  });

  socket.on(EVENT_TYPE.chatMessage, (messageDetail) => {
    const newMessage = { ...messageDetail, username, messageId };
    message = [...message, newMessage];
    io.emit(EVENT_TYPE.chatMessage, newMessage);
  });

  socket.on(EVENT_TYPE.getPreviousMessage, () => {
    io.emit(EVENT_TYPE.setPreviousMessage, message);
  });

  // on disconnection action
  socket.on(EVENT_TYPE.disconnect, () => {
    delete connectedUserList[messageId];
    io.emit(EVENT_TYPE.connectedUserList, { connectedUserList });
  });
});

server.listen(9000, () => {
  console.log("listening at port 9000");
});
