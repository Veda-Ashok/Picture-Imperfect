const express = require('express')
const socket = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    // allowedHeaders: ["my-custom-header"],
    // credentials: true
  },
})

function onConnection() {
  console.log('hello')
  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data)
  })
}

io.on('connection', onConnection)

const port = 8080
server.listen(port, () => console.log(`server is running on port ${port}`))
