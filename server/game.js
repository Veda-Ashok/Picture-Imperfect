const {
  // userLeave,
  updateUser,
} = require('./users')
const { getUsersInRoom } = require('./rooms')
const { getRandomDifficulty, getRandomWord } = require('./words')

function chooseRandomPlayer(players) {
  const index = Math.floor(Math.random() * players.length)
  return players[index]
}

class Game {
  constructor(room, totalRounds, roomCode, io, socket) {
    this.room = room
    this.roles = ['Judge', 'Team 1', 'Team 2']
    this.judges = {}
    this.blueTeam = []
    this.whiteTeam = []
    this.currentDrawers = {}
    this.round = 1
    this.totalRounds = totalRounds
    this.totalDrawTime = 30
    this.playerDrawTime = 4 // SHOULD BE: totalDrawTime / (numberOfPLayersOnTeam * numberOfDrawRotations(aka how many times we loop thru a team))
    this.blueTeamWord = ''
    this.whiteTeamWord = ''
    this.difficulty = 'medium'
    this.possibleJudges = JSON.parse(JSON.stringify(room))
    this.possiblePlayers = JSON.parse(JSON.stringify(room))
    this.roomCode = roomCode
    this.io = io
    this.socket = socket
    // this.pastWords = new Set()
    this.skipToNext = false
    this.turnInterval = undefined
    this.screenshotInterval = undefined

    console.log('TOTAL ROUNDS: ', this.totalRounds)
  }

  getJudges() {
    return this.judges
  }

  getBlueTeamWord() {
    return this.blueTeamWord
  }

  getWhiteTeamWord() {
    return this.whiteTeamWord
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
    const newWord = getRandomWord(this.difficulty, this.roomCode)

    return newWord
  }

  assignWords() {
    this.difficulty = getRandomDifficulty(this.roomCode)
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
    this.blueTeam = this.blueTeam.slice(1)
    this.whiteTeam = this.whiteTeam.slice(1)
    this.blueTeam.push(currentBlueDrawer)
    this.whiteTeam.push(currentWhiteDrawer)
  }

  // END ROUND AFTER THEY GUESS THE WORD
  roundWin(teamName, judge) {
    if (teamName === 'blueTeam') {
      this.blueTeam.forEach((member) => {
        const newPoints = member.points + 1
        updateUser(member.id, 'points', newPoints)
      })
    } else if (teamName === 'whiteTeam') {
      this.whiteTeam.forEach((member) => {
        const newPoints = member.points + 1
        updateUser(member.id, 'points', newPoints)
      })
    }
    const judgePoints = judge.points + 1
    updateUser(judge.id, 'points', judgePoints)
    this.skipToNext = true
    this.goToScreenshot(teamName, judge)
  }

  playGame() {
    this.skipToNext = false
    let timeRemaining = this.totalDrawTime
    const intervalDuration = 1

    // interval waits for intervalDuration (2 seconds) before running the function for the first time
    this.assignRoles()
    this.assignWords()
    this.turnInterval = setInterval(() => {
      const newTurn = timeRemaining % this.playerDrawTime === 0
      if (newTurn) {
        this.rotateDrawers()
        this.io.to(this.roomCode).emit('newDrawers', {
          judges: this.judges,
          blueTeam: this.blueTeam,
          whiteTeam: this.whiteTeam,
          timeRemaining,
        })
      }
      this.io.to(this.roomCode).emit('roundTimer', {
        timeRemaining,
      })
      // the odd seconds
      // emit timer event
      console.log('timeRemaining: ', timeRemaining)
      console.log('interval duration:', intervalDuration)
      timeRemaining -= intervalDuration

      if (timeRemaining <= 0) {
        // they couldnt guess it
        this.goToScreenshot('timeOut')
      }
    }, intervalDuration * 1000)
  }

  goToScreenshot(teamName, judge) {
    clearInterval(this.turnInterval)
    // if winningTeam is undefined then its a time out
    // set ready to false for everyone so that they are not immediately ready on next screenshot page
    // this.room = getUsersInRoom(this.roomCode)
    const players = Object.values(this.room)
    players.forEach((player) => {
      // updateUserInRoom(this.roomCode, player.id, 'ready', false)
      updateUser(player.id, 'ready', false)
    })
    this.room = getUsersInRoom(this.roomCode)
    this.io.to(this.roomCode).emit('screenshotPage', {
      winningTeam: teamName,
      winningJudge: judge,
      players: this.room,
    })
  }

  goToNextRound() {
    if (Object.keys(this.possibleJudges).length <= 0) {
      this.possibleJudges = JSON.parse(JSON.stringify(this.room))
      this.possiblePlayers = JSON.parse(JSON.stringify(this.room))
      this.round += 1
    }
    if (this.round <= this.totalRounds) {
      console.log('in if')
      this.playGame()
    } else {
      this.io.to(this.roomCode).emit('GameOver', {
        players: this.room,
      })
      console.log('game over')
    }
  }

  removePlayer(player) {
    delete this.room[player]
    delete this.judges[player.id]
    delete this.currentDrawers[player]
    delete this.possibleJudges[player]
    delete this.possiblePlayers[player]

    this.blueTeam = this.blueTeam.filter((user) => user.id !== player.id)
    this.whiteTeam = this.whiteTeam.filter((user) => user.id !== player.id)

    // Check if any of the teams are empty and there are more than 3 players
    if (
      (this.blueTeam.length === 0 ||
        this.whiteTeam.length === 0 ||
        Object.keys(this.judges).length === 0) &&
      Object.keys(this.room).length >= 3
    ) {
      this.goToScreenshot('playersLeft')
    }
  }

  killMySelf() {
    clearInterval(this.turnInterval)
  }
}

module.exports = {
  Game,
  chooseRandomPlayer,
}
