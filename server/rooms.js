const { clearWordSet, addWordSet } = require('./words')

const rooms = {}

function generateUID() {
  // I generate the UID from two parts here
  // to ensure the random number provide enough bits.
  let firstPart = (Math.random() * 46656) | 0
  let secondPart = (Math.random() * 46656) | 0
  firstPart = `000${firstPart.toString(36)}`.slice(-3)
  secondPart = `000${secondPart.toString(36)}`.slice(-3)
  return firstPart + secondPart
}

function createRoom() {
  let code = generateUID()
  while (code in rooms) {
    code = generateUID()
  }
  rooms[code] = { totalRounds: 3, players: {} }
  addWordSet(code)
  return code
}

function addUserToRoom(room, userId, user) {
  if (rooms[room]) {
    rooms[room].players[userId] = user
  }
}

function deleteRoom(room) {
  clearWordSet(room)
  delete rooms[room]
}

function removeUserFromRoom(room, userId) {
  if (rooms[room]) {
    delete rooms[room].players[userId]
    if (Object.keys(rooms[room].players).length === 0) {
      deleteRoom(room)
    }
  }
}

function getUsersInRoom(room) {
  if (rooms[room]) {
    return rooms[room].players
  }
  return false
}

function updateUserInRoom(room, userId, key, value) {
  if (rooms[room]) {
    rooms[room].players[userId][key] = value
  }
}

function updateTotalRounds(room, totalRounds) {
  if (rooms[room]) {
    rooms[room].totalRounds = totalRounds
  }
}

function getTotalRounds(room) {
  if (rooms[room]) {
    return rooms[room].totalRounds
  }
  return 0
}

module.exports = {
  createRoom,
  addUserToRoom,
  removeUserFromRoom,
  getUsersInRoom,
  updateUserInRoom,
  deleteRoom,
  updateTotalRounds,
  getTotalRounds,
}
