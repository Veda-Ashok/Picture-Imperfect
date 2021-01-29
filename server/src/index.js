import express from 'express';
import http from 'http';
import socket from 'socket.io'

const app = express();
const server = http.createServer(app);
const io = socket(server)

io.on('connection', onConnection);

function onConnection(socket){
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
}

const port = 8080;
server.listen(port, () => console.log(`server is running on port ${port}`));