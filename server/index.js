// const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./users').default
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from './users'

const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

// function onConnection(socket) {
//   console.log('hello')

//   // handle disconnect
//   socket.on('disconnect', () => {
//     io.emit('message', 'A user has disconnected')
//   })

//   // send drawings to other users
//   socket.on('drawing', (data) => {
//     socket.broadcast.emit('drawing', data)
//   })
// }

io.on('connection', (socket) => {
  console.log('hello')

  // handle joining a room
  socket.on('joinRoom', ({ username, room }) => {
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
    const user = getCurrentUser(socket.id)

    socket.broadcast.to(user.room).emit('drawing', data)
  })
})

const port = 8080
server.listen(port, () => console.log(`server is running on port ${port}`))
