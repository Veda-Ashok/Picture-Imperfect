/* eslint-disable no-unused-vars */
/* Words for game assignemnt by level */

const easy = ['cat', 'dog', 'umbrella', 'mouse', 'apple', 'banana', 'pineapple']
const medium = ['merry-go-round', 'polaroid', 'photo album']
const hard = ['high school', 'carnival', 'castle']
const impossible = ['mystery', 'orange', 'novel', 'regret', 'excited']

const words = { easy, medium, hard, impossible }

function getRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function getRandomDifficulty() {
  return getRandom(Object.keys(words))
}

function getRandomWord(difficulty) {
  return getRandom(words[difficulty])
}

module.exports = {
  words,
  getRandomDifficulty,
  getRandomWord,
}
