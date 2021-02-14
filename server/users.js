const { addUserToRoom, removeUserFromRoom, getUsersInRoom } = require('./rooms')

const users = {}

function userJoin(id, username, room, icon) {
  users[id] = { username, room, icon }
  addUserToRoom(room, id, users[id])
  return users[id]
}
function getUserById(id) {
  return users[id]
}

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

function getUserByUsernameAndRoom(username, room) {
  if (getUsersInRoom(room)) {
    const roomUsers = Object.values(getUsersInRoom(room))
    const user = roomUsers.find((currentUser) => {
      return currentUser.username === username
    })
    return user
  }
  return undefined
}

module.exports = {
  userJoin,
  getUserById,
  userLeave,
  getUserByUsernameAndRoom,
}
