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
const { getRandomDifficulty, getRandomWord } = require('./words')

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
    this.wordDifficulty = 'medium'
    this.possibleJudges = JSON.parse(JSON.stringify(room))
    this.possiblePlayers = JSON.parse(JSON.stringify(room))
    this.roomCode = roomCode
    this.io = io
    this.pastWords = new Set()
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

  pickRandomWord() {
    let newWord = getRandomWord(this.difficulty)
    while (this.pastWords.has(newWord)) {
      newWord = getRandomWord(this.difficulty)
    }
    this.pastWords.add(newWord)
    return newWord
  }

  assignWords() {
    this.difficulty = getRandomDifficulty()
    this.blueTeamWord = this.pickRandomWord()
    this.whiteTeamWord = this.pickRandomWord()
    this.io.to(this.roomCode).emit('wordAssignment', {
      blueTeamWord: this.blueTeamWord,
      whiteTeamWord: this.whiteTeamWord,
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
    this.assignRoles()
    this.assignWords()
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
      //   this.assignRoles()
      //   this.assignWords()
      this.playRound()
    }, (this.totalDrawTime + intervalDuration) * 1000) // add 2 seconds because the interval waits 2 seconds before running
  }

  //   playGame() {
  //     const gameTime = this.totalDrawTime * this.totalRounds
  //     this.assignRoles()
  //     this.playRound()
  //     const interval = setTimeout(() => {
  //       this.assignRoles()
  //       this.playRound()
  //     }, this.totalDrawTime + this.playerDrawTime)
  //     setTimeout(() => {
  //       clearInterval(interval)
  //     })
  //   }

  totalRoundTimer() {
    let timeRemaining = this.totalDrawTime
    const intervalDuration = 1
    console.log('totalDrawtime: ', this.totalDrawTime)
    console.log('playerDrawtime: ', this.playerDrawTime)

    console.log('about to start interval')

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
    }, (this.totalDrawTime + this.playerDrawTime) * 1000)
  }
}

module.exports = {
  Game,
  chooseRandomPlayer,
}
