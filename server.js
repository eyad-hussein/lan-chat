const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = 3000;
const LAN_IP = "192.168.106.175";

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/app/views/index.html");
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

server.listen(PORT, LAN_IP, () => {
  console.log("working");
});
