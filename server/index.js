const express = require('express')
const socket = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

function onConnection(sock) {
  console.log('hello')
  sock.on('drawing', (data) => {
    sock.broadcast.emit('drawing', data)
  })
}

io.on('connection', onConnection)

const port = 8080
server.listen(port, () => console.log(`server is running on port ${port}`))
