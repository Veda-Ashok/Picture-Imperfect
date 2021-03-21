/* eslint-disable no-unused-vars */
/* Words for game assignemnt by level */

// end of game, clear custom words
// what do if there's only 1 custom word? do we pick from a different difficulty, or require at least 2 custom words?

const easy = [
  'apple',
  'banana',
  'beach',
  'cat',
  'dog',
  'dolphin',
  'fork',
  'ghost',
  'mouse',
  'paris',
  'pineapple',
  'star',
  'umbrella',
]
const medium = [
  'aglet',
  'harry potter',
  'merry-go-round',
  'mickey mouse',
  'photo album',
  'polaroid',
  'shrek',
  'spongebob',
  'waffle',
]
const hard = [
  'carnival',
  'castle',
  'disneyland',
  'eclipse',
  'george washington',
  'high school',
  'leprechaun',
  'mario',
  'pikachu',
  'yoshi',
]
const impossible = [
  'darkness',
  'excited',
  'mystery',
  'myth',
  'novel',
  'orange',
  'regret',
  'vegetarian',
]
// const custom = {}

const DEFAULT_WORDS = { easy, medium, hard, impossible }

const wordSets = {}

function addCustomWord(roomCode, word) {
  if (Object.prototype.hasOwnProperty.call(wordSets, roomCode)) {
    if (Object.prototype.hasOwnProperty.call(wordSets[roomCode], 'custom')) {
      if (!wordSets[roomCode].custom.includes(word)) {
        wordSets[roomCode].custom.push(word)
      }
    } else {
      wordSets[roomCode].custom = [word]
    }
    return wordSets[roomCode].custom.length
  }
  console.log('if room already exists', Object.values(wordSets[roomCode].custom))
  return 0
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
  if (!wordSets[roomCode][newDifficulty]) {
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
