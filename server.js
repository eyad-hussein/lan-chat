const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = 5000;
const LAN_IP = "192.168.106.175";

let chatHistory = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/app/views/index.html");
});

io.on("connection", (socket) => {
  socket.emit("chat history", chatHistory);

  socket.on("chat message", (msg) => {
    chatHistory.push(msg);
    io.emit("chat message", msg);
  });
});

server.listen(PORT, () => {
  console.log("working");
});
