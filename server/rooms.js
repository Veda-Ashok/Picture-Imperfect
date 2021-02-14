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
  rooms[code] = {}
  return code
}

function addUserToRoom(room, userId, user) {
  rooms[room][userId] = user
}

function removeUserFromRoom(room, userId) {
  delete rooms[room][userId]
  if (rooms[room] === {}) {
    delete rooms[room]
  }
}

function getUsersInRoom(room) {
  return rooms[room]
}

module.exports = {
  createRoom,
  addUserToRoom,
  removeUserFromRoom,
  getUsersInRoom,
}
