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
const {
  createRoom,
  getUsersInRoom,
  deleteRoom,
  updateTotalRounds,
  getTotalRounds,
} = require('./rooms')
// const { Game } = require('./game')
const { createGame, deleteGame, getGame } = require('./games')
const { addCustomWord, getNumberOfCustomWords } = require('./words')

const io = socketio(http, {
  cors: {
    // origin: 'http://localhost:3000',
    origin: 'https://picture-imperfect.herokuapp.com/',
    methods: ['GET', 'POST'],
  },
})

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
  })

  // handle joining a room
  socket.on('joinRoom', ({ username, room, icon }) => {
    const users = getUsersInRoom(room)
    const userExists = getUserByUsernameAndRoom(username, room)
    const game = getGame(room)

    if (!users) {
      socket.emit('invalidRoomCode', `Sorry, ${room} is invalid! Please enter a different code.`)
    } else if (userExists) {
      socket.emit('invalidUsername', `Sorry, ${username} is already taken in room ${room}`)
    } else if (game) {
      socket.emit('gameAlreadyStarted', `Sorry, the game in ${room} has already started`)
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
            players: getUsersInRoom(user.room),
          })
          deleteGame(game.roomCode)
          deleteRoom(user.room)
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
            players: getUsersInRoom(user.room),
          })
          deleteGame(game.roomCode)
          deleteRoom(user.room)
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

  // handle user getting ready for game
  socket.on('ready', () => {
    let user = getUserById(socket.id)
    user = updateUser(socket.id, 'ready', true)

    const players = Object.values(getUsersInRoom(user.room))
    let everyoneReady = players.length >= 3 && players.length <= 13
    players.forEach((player) => {
      everyoneReady = everyoneReady && player.ready
    })
    if (everyoneReady) {
      io.to(user.room).emit('everyoneReady')
      const room = getUsersInRoom(user.room)
      const roomCode = user.room
      const totalRounds = getTotalRounds(roomCode)
      // const game = new Game(room, 5, roomCode, io, socket)
      createGame(room, totalRounds, roomCode, io, socket)
      const game = getGame(roomCode)
      // startGame(game.roomCode)
      // game.assignRoles()
      io.to(user.room).emit('currentRound', { round: 1, turn: 1 })
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

  // handle user getting ready for next round
  socket.on('roundReady', () => {
    let user = getUserById(socket.id)
    user = updateUser(socket.id, 'ready', true)

    const players = Object.values(getUsersInRoom(user.room))
    let everyoneReady = true
    players.forEach((player) => {
      everyoneReady = everyoneReady && player.ready
    })
    if (everyoneReady) {
      console.log('about to start next Round')
      io.to(user.room).emit('startNextRound')
      const game = getGame(user.room)
      game.goToNextRound()
    }

    // send users room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getUsersInRoom(user.room),
    })
  })

  // handle user no longer ready for next round
  socket.on('notRoundReady', () => {
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
    if (!user) {
      console.log('USER UNDEFINED IN CHAT')
    }
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
    const numberOfCustomWords = addCustomWord(user.room, customWord)
    io.to(user.room).emit('numCustomWords', numberOfCustomWords)
    console.log('added custom word', customWord)
  })

  socket.on('getNumCustom', () => {
    const user = getUserById(socket.id)
    const numberOfCustomWords = getNumberOfCustomWords(user.room)
    io.to(user.room).emit('numCustomWords', numberOfCustomWords)
  })

  socket.on('totalRounds', ({ totalRounds }) => {
    const user = getUserById(socket.id)
    updateTotalRounds(user.room, totalRounds)

    io.to(user.room).emit('totalRounds', totalRounds)
    // console.log('total Rounds: ', totalRounds)
  })

  socket.on('getTotalRounds', () => {
    const user = getUserById(socket.id)
    const totalRounds = getTotalRounds(user.room)

    io.to(user.room).emit('totalRounds', totalRounds)
    // console.log('total Rounds: ', totalRounds)
  })
})
// plsa
const PORT = process.env.PORT || 8080 // comment this to run locally
// const PORT = 8080 // then uncomment this
http.listen(PORT, () => console.log(`server is running on port ${PORT}`))
