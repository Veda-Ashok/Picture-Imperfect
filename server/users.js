const { addUserToRoom, removeUserFromRoom, getUsersInRoom } = require('./rooms')

// const users = []
const users = {}

// function userJoin(id, username, room) {
//   const user = { id, username, room }
//   users.push(user)
//   return user
// }

function userJoin(id, username, room) {
  users[id] = { username, room }
  addUserToRoom(room, id, users[id])
  return users[id]
}

// function getUserById(id) {
//   return users.find((user) => user.id === id)
// }

function getUserById(id) {
  return users[id]
}

// function userLeave(id) {
//   const index = users.findIndex((user) => user.id === id)

//   if (index === -1) {
//     // throw `Error: user with id ${id} not in list`
//     return id
//   }
//   return users.splice(index, 1)[0]
// }

function userLeave(id) {
  const user = users[id]

  if (!user) {
    // throw `Error: user with id ${id} not in list`
    return id
  }
  delete users[id]
  removeUserFromRoom(user.room, id)

  return user
}

// function getRoomUsers(room) {
//   return users.filter((user) => user.room === room)
// }

function getRoomUsers(room) {
  return getUsersInRoom(room)
}

// function getUserByUsernameAndRoom(username, room) {
//   return users.filter((user) => user.room === room && user.username === username)
// }

function getUserByUsernameAndRoom(username, room) {
  const roomUsers = Object.values(getRoomUsers(room))
  const user = roomUsers.find((currentUser) => {
    return currentUser.username === username
  })
  return user
}

module.exports = {
  userJoin,
  getUserById,
  userLeave,
  getRoomUsers,
  getUserByUsernameAndRoom,
}
