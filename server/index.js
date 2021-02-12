// import { userJoin, getCurrentUser, userLeave, getUsersInRoom } from './users'

const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const { userJoin, getUserById, userLeave, getUserByUsernameAndRoom } = require('./users')
const { createRoom, getUsersInRoom } = require('./rooms')

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
    console.log('creating room')
    const room = createRoom()

    console.log(username, room)
    console.log('before joining room')
    const user = userJoin(socket.id, username, room)
    console.log('after joining room')
    socket.join(user.room)

    socket.broadcast.to(user.room).emit('message', `${user.username} has joined`)

    // send users room info
    console.log('emitting room users')
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getUsersInRoom(user.room),
    })
    console.log('done with whole creation method')
  })

  // handle joining a room
  socket.on('joinRoom', ({ username, room }) => {
    console.log(username, room)

    const users = getUsersInRoom(room)
    const userExists = getUserByUsernameAndRoom(username, room)

    if (!users) {
      socket.emit('invalidRoomCode', `${room} does not exist`)
    } else if (userExists) {
      socket.emit('invalidUsername', `${username} is already taken in room ${room}`)
    } else {
      const user = userJoin(socket.id, username, room)

      socket.join(user.room)

      socket.broadcast.to(user.room).emit('message', `${user.username} has joined`)

      // send users room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getUsersInRoom(user.room),
      })
    }
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
        users: getUsersInRoom(user.room),
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
