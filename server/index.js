const express = require('express')
const socketio = require('socket.io')
const path = require('path')

const app = express()
const http = require('http').createServer(app)

const {
  userJoin,
  getUserById,
  userLeave,
  getUserByUsernameAndRoom,
  updateUser,
} = require('./users')
const { createRoom, getUsersInRoom } = require('./rooms')
const { createGame, deleteGame, getGame } = require('./games')
const { addCustomWord } = require('./words')

const io = socketio(http, {
  cors: {
    origin: 'http://localhost:3000',
    // origin: 'https://picture-imperfect.herokuapp.com/',
    methods: ['GET', 'POST'],
  },
})
// let game

app.use(express.static(path.join(__dirname, '../build')))
console.log(__dirname)

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'))
})

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

      const game = getGame(user.room)
      if (game) {
        game.removePlayer(user)

        if (Object.keys(game.room).length < 3) {
          game.io.to(game.roomCode).emit('gameOver', {
            judges: game.judges,
            blueTeam: game.blueTeam,
            whiteTeam: game.whiteTeam,
          })
          deleteGame(game.roomCode)
        } else {
          game.io.to(game.roomCode).emit('roomRoles', {
            judges: game.judges,
            blueTeam: game.blueTeam,
            whiteTeam: game.whiteTeam,
          })
        }
      }
    }
  })

  // handle disconnect
  socket.on('manualDisconnect', () => {
    console.log('Later Nerd')

    const user = userLeave(socket.id)
    if (user) {
      io.to(user.room).emit('message', `${user.username} has disconnected`)

      // send users room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getUsersInRoom(user.room),
      })

      const game = getGame(user.room)
      if (game) {
        game.removePlayer(user)

        if (Object.keys(game.room).length < 3) {
          game.io.to(game.roomCode).emit('gameOver', {
            judges: game.judges,
            blueTeam: game.blueTeam,
            whiteTeam: game.whiteTeam,
          })
          deleteGame(game.roomCode)
        } else {
          game.io.to(game.roomCode).emit('roomRoles', {
            judges: game.judges,
            blueTeam: game.blueTeam,
            whiteTeam: game.whiteTeam,
          })
        }
      }
    }
  })

  let numOfCustom
  // handle user getting ready for game
  socket.on('ready', () => {
    let user = getUserById(socket.id)
    user = updateUser(socket.id, 'ready', true)

    const players = Object.values(getUsersInRoom(user.room))
    let everyoneReady = players.length >= 3
    players.forEach((player) => {
      everyoneReady = everyoneReady && player.ready
    })
    if (everyoneReady && (!numOfCustom || numOfCustom >= 2)) {
      io.to(user.room).emit('everyoneReady')
      const room = getUsersInRoom(user.room)
      const roomCode = user.room

      // const game = new Game(room, 5, roomCode, io, socket)
      createGame(room, 5, roomCode, io, socket)
      const game = getGame(roomCode)
      // startGame(game.roomCode)
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
    const game = getGame(user.room)
    if (Object.prototype.hasOwnProperty.call(game.getJudges(), socket.id)) {
      if (message.toLowerCase() === game.getBlueTeamWord().toLowerCase()) {
        // roundWin('blueTeam', user, user.room)
        game.roundWin('blueTeam', user)
        console.log('blueTeam win')
      } else if (message.toLowerCase() === game.getWhiteTeamWord().toLowerCase()) {
        // roundWin('whiteTeam', user, user.room)
        game.roundWin('whiteTeam', user)
        console.log('whiteTeam win')
      }
    }
    console.log('chat recieved', message, 'room', user.room)
    const payload = { text: message, name: user.username }
    io.to(user.room).emit('chat', payload)
  })

  socket.on('addCustom', ({ customWord }) => {
    const user = getUserById(socket.id)
    numOfCustom = addCustomWord(user.room, customWord)
    io.to(user.room).emit('numCustomWords', numOfCustom)
    console.log('added custom word', customWord, { numOfCustom })
  })
})

const PORT = process.env.PORT || 8080 // comment this to run locally
// const PORT = 8080 // then uncomment this
http.listen(PORT, () => console.log(`server is running on port ${PORT}`))
