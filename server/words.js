/* eslint-disable no-unused-vars */
/* Words for game assignemnt by level */

// end of game, clear custom words
// what do if there's only 1 custom word? do we pick from a different difficulty, or require at least 2 custom words?

const easy = ['cat', 'dog', 'umbrella', 'mouse', 'apple', 'banana', 'pineapple']
const medium = ['merry-go-round', 'polaroid', 'photo album']
const hard = ['high school', 'carnival', 'castle']
const impossible = ['mystery', 'orange', 'novel', 'regret', 'excited']
// const custom = {}

const DEFAULT_WORDS = { easy, medium, hard, impossible, custom: [] }

const wordSets = {}

function addCustomWord(roomCode, word) {
  if (Object.prototype.hasOwnProperty.call(wordSets, roomCode)) {
    if (!wordSets[roomCode].custom.includes(word)) {
      wordSets[roomCode].custom = [...wordSets[roomCode].custom, word]
    }
  }
  console.log('if room already exists', Object.values(wordSets[roomCode].custom))
}

function addWordSet(roomCode) {
  wordSets[roomCode] = JSON.parse(JSON.stringify(DEFAULT_WORDS))
}

function clearWordSet(roomCode) {
  delete wordSets[roomCode]
  console.log(wordSets[roomCode])
}

function getRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function getRandomDifficulty(roomCode) {
  return getRandom(Object.keys(wordSets[roomCode]))
}

function getRandomWord(difficulty, roomCode) {
  let newDifficulty = difficulty
  if (!wordSets[roomCode][difficulty]) {
    newDifficulty = getRandomDifficulty(roomCode)
  }
  const wordList = wordSets[roomCode][newDifficulty]
  const word = getRandom(wordList)
  const index = wordSets[roomCode][newDifficulty].indexOf(word)
  wordSets[roomCode][newDifficulty].splice(index, 1)
  console.log(wordSets)
  if (wordSets[roomCode][newDifficulty].length < 1) {
    delete wordSets[roomCode][newDifficulty]
  }
  return word
}

module.exports = {
  wordSets,
  addWordSet,
  addCustomWord,
  clearWordSet,
  getRandomDifficulty,
  getRandomWord,
}
