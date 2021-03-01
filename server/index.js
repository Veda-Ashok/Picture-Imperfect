const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const {
  userJoin,
  getUserById,
  userLeave,
  getUserByUsernameAndRoom,
  updateUser,
} = require('./users')
const { createRoom, getUsersInRoom } = require('./rooms')
const { Game } = require('./game')

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})
let game

io.on('connection', (socket) => {
  console.log('hello')

  // handle creating a room
  socket.on('createRoom', ({ username, icon }) => {
    const room = createRoom()

    const user = userJoin(socket.id, username, room, icon)
    socket.join(user.room)

    socket.broadcast.to(user.room).emit('message', `${user.username} has joined`)

    // send users room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getUsersInRoom(user.room),
    })
    console.log('done with whole creation method')
  })

  // handle joining a room
  socket.on('joinRoom', ({ username, room, icon }) => {
    const users = getUsersInRoom(room)
    const userExists = getUserByUsernameAndRoom(username, room)

    if (!users) {
      socket.emit('invalidRoomCode', `Sorry, ${room} is invalid! Please enter a different code.`)
    } else if (userExists) {
      socket.emit('invalidUsername', `Sorry, ${username} is already taken in room ${room}`)
    } else {
      const user = userJoin(socket.id, username, room, icon)

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

  // handle user getting ready for game
  socket.on('ready', () => {
    let user = getUserById(socket.id)
    user = updateUser(socket.id, 'ready', true)

    const players = Object.values(getUsersInRoom(user.room))
    let everyoneReady = players.length >= 3
    players.forEach((player) => {
      everyoneReady = everyoneReady && player.ready
    })
    if (everyoneReady) {
      io.to(user.room).emit('everyoneReady')
      const room = getUsersInRoom(user.room)
      const roomCode = user.room

      game = new Game(room, 5, roomCode, io, socket)
      // game.assignRoles()
      game.playGame()
    }

    // send users room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getUsersInRoom(user.room),
    })
  })

  // handle user no longer ready for game
  socket.on('notReady', () => {
    let user = getUserById(socket.id)
    user = updateUser(socket.id, 'ready', false)

    // send users room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getUsersInRoom(user.room),
    })
  })

  // send drawings to other users
  socket.on('drawing', (data) => {
    const user = getUserById(socket.id)

    socket.broadcast.to(user.room).emit('drawing', data)
  })

  // send messages in chat
  socket.on('chat', ({ message }) => {
    const user = getUserById(socket.id)
    if (Object.prototype.hasOwnProperty.call(game.getJudges(), socket.id)) {
      if (message.toLowerCase() === game.getBlueTeamWord().toLowerCase()) {
        game.roundWin('blueTeam', user)
        console.log('blueTeam win')
      } else if (message.toLowerCase() === game.getWhiteTeamWord().toLowerCase()) {
        game.roundWin('whiteTeam', user)
        console.log('whiteTeam win')
      }
    }
    console.log('chat recieved', message, 'room', user.room)
    const payload = { text: message, name: user.username }
    io.to(user.room).emit('chat', payload)
  })
})

const port = 8080
server.listen(port, () => console.log(`server is running on port ${port}`))
