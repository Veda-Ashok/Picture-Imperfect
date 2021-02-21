// const {
//   userJoin,
//   getUserById,
//   userLeave,
//   getUserByUsernameAndRoom,
//   updateUser,
// } = require('./users')
// const { createRoom, getUsersInRoom } = require('./rooms')

// function runGame(room) {
//   return room
// }

// function createTeams() {

// }

// module.exports = {
//   runGame,
// }

function chooseRandomPlayer(players) {
  const index = Math.floor(Math.random() * players.length)
  return players[index]
}

class Game {
  constructor(room, totalRounds, roomCode, io) {
    this.room = room
    this.roles = ['Judge', 'Team 1', 'Team 2']
    this.judges = {}
    this.blueTeam = []
    this.whiteTeam = []
    this.currentDrawers = {}
    this.round = 1
    this.totalRounds = totalRounds
    this.drawTime = 30
    this.blueTeamWord = ''
    this.whiteTeamWord = ''
    this.possibleJudges = JSON.parse(JSON.stringify(room))
    this.possiblePlayers = JSON.parse(JSON.stringify(room))
    this.roomCode = roomCode
    this.io = io
  }

  assignJudge() {
    const key = chooseRandomPlayer(Object.keys(this.possibleJudges))
    this.judges[key] = this.possibleJudges[key]
    delete this.possibleJudges[key]
    delete this.possiblePlayers[key]
  }

  assignTeam() {
    const key = chooseRandomPlayer(Object.keys(this.possiblePlayers))
    if (this.blueTeam.length > this.whiteTeam.length) {
      this.whiteTeam.push(this.possiblePlayers[key])
    } else {
      this.blueTeam.push(this.possiblePlayers[key])
    }
    delete this.possiblePlayers[key]
  }

  assignRoles() {
    this.assignJudge()
    if (Object.keys(this.room).length % 2 === 0) {
      this.assignJudge()
    }
    while (Object.keys(this.possiblePlayers).length > 0) {
      this.assignTeam()
    }
    this.io.to(this.roomCode).emit('roomRoles', {
      judges: this.judges,
      blueTeam: this.blueTeam,
      whiteTeam: this.whiteTeam,
    })
  }
}

module.exports = {
  Game,
  chooseRandomPlayer,
}
