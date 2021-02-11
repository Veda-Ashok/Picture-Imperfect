// import { userJoin, getCurrentUser, userLeave, getRoomUsers } from './users'

const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const { userJoin, getUserById, userLeave, getRoomUsers } = require('./users')
const { createRoom } = require('./rooms')

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('hello')

  // handle creating a room
  socket.on('createRoom', ({ username }) => {
    const room = createRoom()

    console.log(username, room)
    const user = userJoin(socket.id, username, room)

    socket.join(user.room)

    socket.broadcast.to(user.room).emit('message', `${user.username} has joined`)

    // send users room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    })
  })

  // handle joining a room
  socket.on('joinRoom', ({ username, room }) => {
    console.log(username, room)
    const user = userJoin(socket.id, username, room)

    socket.join(user.room)

    socket.broadcast.to(user.room).emit('message', `${user.username} has joined`)

    // send users room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    })
  })

  // handle disconnect
  socket.on('disconnect', () => {
    console.log('Later Nerd')

    const user = userLeave(socket.id)
    if (user) {
      io.to(user.room).emit('message', `${user.username} has disconnected`)

      // send users room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      })
    }
  })

  // send drawings to other users
  socket.on('drawing', (data) => {
    const user = getUserById(socket.id)

    socket.broadcast.to(user.room).emit('drawing', data)
  })
})

const port = 8080
server.listen(port, () => console.log(`server is running on port ${port}`))
