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
  'mushroom',
  'snowman',
  'carrot',
  'lamp',
  'computer',
  'heart',
  'star',
  'glasses',
  'hat',
  'pants',
  'shirt',
  'pencil',
  'bed',
  'bag',
  'ramen',
  'elephant',
  'watermelon',
  'lemon',
  'tripod',
  'dinosaur',
  'dragon',
  'wizard',
  'stocks',
  'thunderstorm',
  'compass',
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
  'bicycle',
  'moped',
  'vampire',
  'zombie',
  'ferris wheel',
  'garden',
  'beach',
  'marriage',
  'programming',
  'girlfriend',
  'boyfriend',
  'planks',
  'weather',
  'sugar daddy',
  'sugar mama',
  'children',
  'parents',
  'volleyball',
  'report card',
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
  'heaven',
  'hell',
  'desert',
  'killer',
  'lover',
  'company',
  'game',
  'fighting',
  'minecraft',
  'university',
  'two-faced',
  'class',
  'motorcycle',
  'apocalypse',
  'hannah montana',
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
  'free',
  'beauty',
  'fear',
  'anger',
  'revenge',
  'betrayal',
  'drama',
  'degree',
  'dilemma',
]

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
  // console.log('if room already exists', Object.values(wordSets[roomCode].custom))
  return 0
}

function getNumberOfCustomWords(roomCode) {
  if (Object.prototype.hasOwnProperty.call(wordSets, roomCode)) {
    if (Object.prototype.hasOwnProperty.call(wordSets[roomCode], 'custom')) {
      return wordSets[roomCode].custom.length
    }
  }
  return 0
}

function addWordSet(roomCode) {
  wordSets[roomCode] = JSON.parse(JSON.stringify(DEFAULT_WORDS))
}

function clearWordSet(roomCode) {
  delete wordSets[roomCode]
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
  getNumberOfCustomWords,
}
