const { Game } = require('./game')
const { deleteRoom } = require('./rooms')

const games = {}

function createGame(room, totalRounds, roomCode, io, socket) {
  const game = new Game(room, totalRounds, roomCode, io, socket)
  games[game.roomCode] = game
}

function deleteGame(roomCode) {
  console.log(`Im going to delete the game in ${roomCode}`)
  if (games[roomCode]) {
    console.log(`I look like this ${games[roomCode]}`)
    games[roomCode].killMySelf()
    console.log(`I killed myself`)
    delete games[roomCode]
    console.log(`I deleted the game`)
    deleteRoom(this.roomCode)
    console.log(`I deleted the room`)
  }
}

function getGame(roomCode) {
  return games[roomCode]
}

function removePlayerFromGame(player, roomCode) {
  games[roomCode].removePlayer(player)
}

function startGame(roomCode) {
  games[roomCode].playGame()
}

function roundWin(teamName, judge, roomCode) {
  games[roomCode].roundWind(teamName, judge)
}

module.exports = {
  createGame,
  deleteGame,
  getGame,
  removePlayerFromGame,
  startGame,
  roundWin,
}
