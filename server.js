const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = 5000;
// const LAN_IP = "192.168.106.175";

let chatHistory = [];
let user_ip_to_nickname = {};

app.use(express.static("./public"));

io.on("connection", (socket) => {
  const user_ip = socket.handshake.address.split(":").pop();
  console.log(`a user connected on ${user_ip}`);
  socket.emit("chat history", chatHistory);

  socket.on("chat message", (received_message) => {
    received_message = { ...received_message, nickname: user_ip_to_nickname[user_ip] };
    chatHistory.push([received_message]);
    io.emit("chat message", received_message);
  });

  socket.on('nickname', (nickname) => {
    user_ip_to_nickname[user_ip] = nickname;
  });
});

server.listen(PORT, () => {
  console.log(`working on port ${PORT}`);
});
