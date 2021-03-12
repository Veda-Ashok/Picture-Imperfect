const {
  // userLeave,
  updateUser,
} = require('./users')
const { getUsersInRoom } = require('./rooms')

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
  constructor(room, totalRounds, roomCode, io, socket) {
    this.room = room
    this.roles = ['Judge', 'Team 1', 'Team 2']
    this.judges = {}
    this.blueTeam = []
    this.whiteTeam = []
    this.currentDrawers = {}
    this.round = 1
    this.totalRounds = totalRounds
    this.totalDrawTime = 60
    this.playerDrawTime = 4 // SHOULD BE: totalDrawTime / (numberOfPLayersOnTeam * numberOfDrawRotations(aka how many times we loop thru a team))
    this.blueTeamWord = ''
    this.whiteTeamWord = ''
    this.difficulty = 'medium'
    this.possibleJudges = JSON.parse(JSON.stringify(room))
    this.possiblePlayers = JSON.parse(JSON.stringify(room))
    this.roomCode = roomCode
    this.io = io
    this.socket = socket
    this.pastWords = new Set()
    this.skipToNext = false
    this.turnInterval = undefined
    this.timerInterval = undefined
    // this.words = JSON.parse(JSON.stringify(words))

    // if (customWords.length > 0) {
    //   Object.keys(this.words).forEach((difficulty) => {
    //     this.words[difficulty] = [...this.words[difficulty], ...customWords]
    //     // this.words[difficulty].concat(customWords)
    //   })
    // }
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
    // DELETE THIS CHECK WHEN WE HAVE ENOUGH WORDS TO NOT RUN OUT IN A GAME
    // words[this.difficulty].forEach((word) => {
    //   if (!this.pastWords.has(word)) {
    //     this.pastWords = new Set()
    //   }
    // })
    // END OF BLOCK TO BE DELETED
    let newWord = getRandomWord(this.difficulty, this.roomCode)
    while (this.pastWords.has(newWord)) {
      newWord = getRandomWord(this.difficulty, this.roomCode)
    }
    // this.pastWords.add(newWord)

    return newWord
  }

  // checkWord(currentWord) {
  //   // send messages in chat
  //   this.socket.on('correctAnswer', ({ message }) => {
  //     // const user = getUserById(socket.id)
  //     // console.log('chat recieved', message, 'room', user.room)
  //     if (message.equals(currentWord)) {
  //       const payload = { text: message, name: user.username }
  //       this.io.to(this.room).emit('correctAnswer', payload)
  //     }
  //   })
  // }

  assignWords() {
    console.log('about to getRandomDifficulty')
    this.difficulty = getRandomDifficulty()
    console.log('gettingRandomDifficulty', this.difficulty)
    console.log('about to pick blue word')
    this.blueTeamWord = this.pickRandomWord()
    console.log('about to pick white word')
    this.whiteTeamWord = this.pickRandomWord()
    while (this.whiteTeamWord === this.blueTeamWord) {
      this.whiteTeamWord = this.pickRandomWord()
    }
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

  // END ROUND AFTER THEY GUESS THE WORD
  roundWin(teamName, judge) {
    clearInterval(this.turnInterval)
    clearInterval(this.timerInterval)
    console.log('blueTeam', this.blueTeam)
    console.log('whiteTeam', this.whiteTeam)
    if (teamName === 'blueTeam') {
      this.blueTeam.forEach((member) => {
        console.log('member id: ', member.id)
        console.log('member points: ', member.points)

        const newPoints = member.points + 1
        updateUser(member.id, 'points', newPoints)
      })
    } else if (teamName === 'whiteTeam') {
      this.whiteTeam.forEach((member) => {
        console.log('member id', member.id)
        console.log('member points: ', member.points)

        const newPoints = member.points + 1
        updateUser(member.id, 'points', newPoints)
      })
    }
    const judgePoints = judge.points + 1
    updateUser(judge.id, 'points', judgePoints)
    this.skipToNext = true
    this.goNextRound()
  }

  playGame() {
    this.skipToNext = false
    let timeRemaining = this.totalDrawTime
    const intervalDuration = 1
    console.log('totalDrawtime: ', this.totalDrawTime)
    console.log('playerDrawtime: ', this.playerDrawTime)

    // interval waits for intervalDuration (2 seconds) before running the function for the first time
    console.log('assigning roles')
    this.assignRoles()
    console.log('assigning words')
    this.assignWords()
    console.log('about to start interval')
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
      // console.log('timeRemaining: ', timeRemaining)
      // console.log('interval duration:', intervalDuration)
      timeRemaining -= intervalDuration

      if (timeRemaining <= 0) {
        // they couldnt guess it
        clearInterval(this.turnInterval)
        this.goNextRound()
      }
    }, intervalDuration * 1000)

    console.log('about to set timeout')

    // setTimeout(() => {

    // }, (this.totalDrawTime + intervalDuration) * 1000) // add 2 seconds because the interval waits 2 seconds before running
  }

  goNextRound() {
    this.room = getUsersInRoom(this.roomCode)

    if (Object.keys(this.possibleJudges).length <= 0) {
      this.possibleJudges = JSON.parse(JSON.stringify(this.room))
      this.possiblePlayers = JSON.parse(JSON.stringify(this.room))
      this.round = +1
    }
    if (this.round <= this.totalRounds) {
      this.playGame()
    }
  }

  removePlayer(player) {
    delete this.room[player]
    delete this.judges[player]
    delete this.currentDrawers[player]
    delete this.possibleJudges[player]
    delete this.possiblePlayers[player]

    this.blueTeam = this.blueTeam.filter((user) => user.id !== player.id)
    this.whiteTeam = this.whiteTeam.filter((user) => user.id !== player.id)

    // if (Object.keys(this.room).length < 3) {
    //   this.io.to(this.roomCode).emit('gameOver', {
    //     judges: this.judges,
    //     blueTeam: this.blueTeam,
    //     whiteTeam: this.whiteTeam,
    //   })
    // } else {
    //   this.io.to(this.roomCode).emit('roomRoles', {
    //     judges: this.judges,
    //     blueTeam: this.blueTeam,
    //     whiteTeam: this.whiteTeam,
    //   })
    // }
  }

  killMySelf() {
    clearInterval(this.turnInterval)
    clearInterval(this.timerInterval)
  }
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

//   totalRoundTimer() {
//     let timeRemaining = this.totalDrawTime
//     const intervalDuration = 1

//     this.timerInterval = setInterval(() => {
//       this.io.to(this.roomCode).emit('roundTimer', {
//         judges: this.judges,
//         blueTeam: this.blueTeam,
//         whiteTeam: this.whiteTeam,
//         timeRemaining,
//       })
//       timeRemaining -= intervalDuration
//       if (timeRemaining <= 0) {
//         // nobody could get it
//         console.log('about to clear timer interval')
//         clearInterval(this.timerInterval)
//       }
//     }, intervalDuration * 1000)
//     // setTimeout(() => {
//     //   console.log(`SKIPTONEXT IS: ${this.skipToNext}`)
//     //   if (!this.skipToNext) {
//     //     console.log('CLEARING ROUND TIMER IN TOTALROUNDTIMER')
//     //     clearInterval(this.timerInterval)
//     //     this.totalRoundTimer()
//     //   }
//     // }, (this.totalDrawTime + this.playerDrawTime) * 1000)
//   }

module.exports = {
  Game,
  chooseRandomPlayer,
}
