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
    this.totalDrawTime = 30
    this.playerDrawTime = 2
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

  rotateDrawers() {
    const currentBlueDrawer = this.blueTeam[0]
    const currentWhiteDrawer = this.whiteTeam[0]
    this.blueTeam = this.blueTeam.slice(1, this.blueTeam.length).push(currentBlueDrawer)
    this.whiteTeam = this.whiteTeam.slice(1, this.whiteTeam.length).push(currentWhiteDrawer)
  }

  playRound() {
    let timeRemaining = this.totalDrawTime
    const intervalDuration = this.playerDrawTime
    console.log('totalDrawtime: ', this.totalDrawTime)
    console.log('playerDrawtime: ', this.playerDrawTime)

    console.log('about to start interval')

    // interval waits for intervalDuration (2 seconds) before running the function for the first time
    const interval = setInterval(() => {
      this.io.to(this.roomCode).emit('newDrawers', {
        judges: this.judges,
        blueTeam: this.blueTeam,
        whiteTeam: this.whiteTeam,
        timeRemaining,
      })
      console.log('timeRemaining: ', timeRemaining)
      console.log('interval duration:', intervalDuration)
      timeRemaining -= intervalDuration
    }, intervalDuration * 1000)

    console.log('about to set timeout')
    setTimeout(() => {
      clearInterval(interval)
      this.playRound()
    }, (this.totalDrawTime + intervalDuration) * 1000)
  }

  totalRoundTimer() {
    let timeRemaining = this.totalDrawTime
    const intervalDuration = 1
    console.log('totalDrawtime: ', this.totalDrawTime)
    console.log('playerDrawtime: ', this.playerDrawTime)

    console.log('about to start interval')

    // interval waits for intervalDuration (2 seconds) before running the function for the first time
    const interval = setInterval(() => {
      this.io.to(this.roomCode).emit('roundTimer', {
        judges: this.judges,
        blueTeam: this.blueTeam,
        whiteTeam: this.whiteTeam,
        timeRemaining,
      })
      console.log('timeRemaining: ', timeRemaining)
      console.log('interval duration:', intervalDuration)
      timeRemaining -= intervalDuration
    }, intervalDuration * 1000)

    console.log('about to set timeout')
    setTimeout(() => {
      clearInterval(interval)
      this.totalRoundTimer()
    }, (this.totalDrawTime + this.playerDrawTime) * 1000) // add 2 seconds because the interval waits 2 seconds before running
  }

  /*
    timeRemaining = 120;
    intervalDuration = 10;
    let interval = setInterval(() => {
      this.broadcast('!TIME:' + timeRemaining, this.players);
      timeRemaining -= intervalDuration;
    }, intervalDuration*1000);
    this.isDay = true;
    this.roomState = 'daytime';
    this.broadcast(`!TIME:120`, this.players);
    this.broadcast('!NEWSTATE:daytime', this.players);
    setTimeout(() => {
      clearInterval(interval);
      this.switchTime();
    }, 120000);
  */
}

module.exports = {
  Game,
  chooseRandomPlayer,
}
