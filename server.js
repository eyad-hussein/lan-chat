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
let num_users = 0;

app.use(express.static("./public"));

io.on("connection", (socket) => {
  num_users += 1;
  const user_ip = socket.handshake.address.split(":").pop();
  console.log(`a user connected on ${user_ip}`);
  socket.emit("chat history", chatHistory);
  io.emit("num_users", num_users);

  socket.on('disconnect', () => {
    num_users -= 1;
    console.log(`user disconnected on ${user_ip} `);
    io.emit("num_users", num_users);
  });

  socket.on("chat message", (received_message) => {
    received_message = { ...received_message, nickname: user_ip_to_nickname[user_ip], time_stamp: new Date().toLocaleTimeString() };
    chatHistory.push([received_message]);
    io.emit("chat message", received_message);
  });

  socket.on('nickname', (nickname) => {
    user_ip_to_nickname[user_ip] = nickname;
    console.log(user_ip_to_nickname);
  });
});

server.listen(PORT, () => {
  console.log(`working on port ${PORT}`);
});
