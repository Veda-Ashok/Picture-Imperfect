/* eslint-disable no-unused-vars */
/* Words for game assignemnt by level */

// end of game, clear custom words
// what do if there's only 1 custom word? do we pick from a different difficulty, or require at least 2 custom words?

const easy = ['cat', 'dog', 'umbrella', 'mouse', 'apple', 'banana', 'pineapple']
const medium = ['merry-go-round', 'polaroid', 'photo album']
const hard = ['high school', 'carnival', 'castle']
const impossible = ['mystery', 'orange', 'novel', 'regret', 'excited']
const custom = {}

const words = { easy, medium, hard, impossible, custom }

function addCustomWord(roomCode, word) {
  if (Object.prototype.hasOwnProperty.call(custom, roomCode)) {
    if (!custom[roomCode].find((current) => current === word)) {
      custom[roomCode] = [...custom[roomCode], word]
    }
    console.log('if room already exists', Object.values(custom))
  } else {
    custom[roomCode] = [word]
    console.log('room doesnt exists', Object.values(custom))
  }
}

function clearCustomWords(roomCode) {
  delete custom[roomCode]
  console.log(custom[roomCode])
}

function getRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function getRandomDifficulty() {
  return getRandom(Object.keys(words))
}

function getRandomWord(difficulty, roomCode) {
  let wordList
  if (difficulty === 'custom') {
    if (!Object.prototype.hasOwnProperty.call(custom, roomCode)) {
      wordList = words[getRandomDifficulty()]
    } else {
      wordList = custom[roomCode]
    }
  } else {
    wordList = words[difficulty]
  }
  return getRandom(wordList)
}

module.exports = {
  words,
  addCustomWord,
  clearCustomWords,
  getRandomDifficulty,
  getRandomWord,
}
