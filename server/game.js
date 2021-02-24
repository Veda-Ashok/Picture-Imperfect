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
const { words, getRandomDifficulty, getRandomWord } = require('./words')

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

  assignPlayerToTeam() {
    const key = chooseRandomPlayer(Object.keys(this.possiblePlayers))
    if (this.blueTeam.length > this.whiteTeam.length) {
      this.whiteTeam.push(this.possiblePlayers[key])
    } else {
      this.blueTeam.push(this.possiblePlayers[key])
    }
    delete this.possiblePlayers[key]
  }

  assignRoles() {
    this.judges = {}
    this.blueTeam = []
    this.whiteTeam = []
    this.possiblePlayers = JSON.parse(JSON.stringify(this.room))
    this.assignJudge()
    if (Object.keys(this.room).length % 2 === 0) {
      this.assignJudge()
    }
    while (Object.keys(this.possiblePlayers).length > 0) {
      this.assignPlayerToTeam()
    }
    this.io.to(this.roomCode).emit('roomRoles', {
      judges: this.judges,
      blueTeam: this.blueTeam,
      whiteTeam: this.whiteTeam,
    })
  }

  pickRandomWord() {
    // DELETE THIS CHECK WHEN WE HAVE ENOUGH WORDS TO NOT RUN OUT IN A GAME
    words.forEach((word) => {
      if (!this.pastWords.has(word)) {
        this.pastWords = new Set()
      }
    })
    // END OF BLOCK TO BE DELETED
    let newWord = getRandomWord(this.difficulty)
    while (this.pastWords.has(newWord)) {
      newWord = getRandomWord(this.difficulty)
    }
    this.pastWords.add(newWord)
    return newWord
  }

  assignWords() {
    console.log('about to getRandomDifficulty')
    this.difficulty = getRandomDifficulty()
    console.log('about to pick blue word')
    this.blueTeamWord = this.pickRandomWord()
    console.log('about to pick white word')
    this.whiteTeamWord = this.pickRandomWord()
    console.log('about to emit wordAssignment')
    this.io.to(this.roomCode).emit('wordAssignment', {
      blueTeamWord: this.blueTeamWord,
      whiteTeamWord: this.whiteTeamWord,
    })
  }

  rotateDrawers() {
    const currentBlueDrawer = this.blueTeam[0]
    const currentWhiteDrawer = this.whiteTeam[0]
    this.blueTeam = this.blueTeam.slice(1)
    this.whiteTeam = this.whiteTeam.slice(1)
    this.blueTeam.push(currentBlueDrawer)
    this.whiteTeam.push(currentWhiteDrawer)
  }

  playGame() {
    let timeRemaining = this.totalDrawTime
    const intervalDuration = this.playerDrawTime
    console.log('totalDrawtime: ', this.totalDrawTime)
    console.log('playerDrawtime: ', this.playerDrawTime)

    // interval waits for intervalDuration (2 seconds) before running the function for the first time
    console.log('assigning roles')
    this.assignRoles()
    console.log('assigning words')
    this.assignWords()
    console.log('about to start interval')
    const interval = setInterval(() => {
      this.rotateDrawers()
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

      if (Object.keys(this.possibleJudges).length <= 0) {
        this.possibleJudges = JSON.parse(JSON.stringify(this.room))
        this.possiblePlayers = JSON.parse(JSON.stringify(this.room))
        this.round = +1
      }
      if (this.round <= this.totalRounds) {
        this.playGame()
      }
      //   this.assignRoles()
      //   this.assignWords()
    }, (this.totalDrawTime + intervalDuration) * 1000) // add 2 seconds because the interval waits 2 seconds before running
  }

  // playRound() {
  //   this.playTurn()
  //   while (Object.keys(this.possibleJudges).length > 0) {
  //     setTimeout(() => {
  //       this.playTurn()
  //     }, (this.totalDrawTime + this.playerDrawTime) * 1000)
  //   }
  // }

  // playGame() {
  //   for (let round = 1; round <= this.totalRounds; round += 1) {
  //     this.possibleJudges = JSON.parse(JSON.stringify(this.room))
  //     this.possiblePlayers = JSON.parse(JSON.stringify(this.room))
  //     this.playRound()
  //   }
  // }

  totalRoundTimer() {
    let timeRemaining = this.totalDrawTime
    const intervalDuration = 1

    const interval = setInterval(() => {
      this.io.to(this.roomCode).emit('roundTimer', {
        judges: this.judges,
        blueTeam: this.blueTeam,
        whiteTeam: this.whiteTeam,
        timeRemaining,
      })
      timeRemaining -= intervalDuration
    }, intervalDuration * 1000)
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
