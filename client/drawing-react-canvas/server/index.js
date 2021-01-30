const express = require("express");
const socket = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    // credentials: true
  }})

io.on("connection", onConnection);

function onConnection(socket) {
  console.log("hello");
  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data);
  });
}

const port = 8080;
server.listen(port, () => console.log(`server is running on port ${port}`));
