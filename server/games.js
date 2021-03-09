const { Game } = require('./game')

const games = {}

function createGame(room, totalRounds, roomCode, io, socket) {
  const game = new Game(room, totalRounds, roomCode, io, socket)
  games[game.roomCode] = game
}

function deleteGame(roomCode) {
  games[roomCode].killMySelf()
  delete games[roomCode]
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
