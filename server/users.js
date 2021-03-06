const { addUserToRoom, removeUserFromRoom, getUsersInRoom, updateUserInRoom } = require('./rooms')

const users = {}

function userJoin(id, username, room, icon) {
  users[id] = { username, room, icon, ready: false, points: 0, id }
  addUserToRoom(room, id, users[id])
  return users[id]
}

function getUserById(id) {
  if (Object.prototype.hasOwnProperty.call(users, id)) {
    return users[id]
  }
  return undefined
}

function userLeave(id) {
  if (Object.prototype.hasOwnProperty.call(users, id)) {
    const user = users[id]

    if (!user) {
      // throw `Error: user with id ${id} not in list`
      return id
    }
    delete users[id]
    removeUserFromRoom(user.room, id)

    return user
  }
  return undefined
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

function updateUser(id, key, value) {
  if (Object.prototype.hasOwnProperty.call(users, id)) {
    users[id][key] = value
    const { room } = users[id]
    updateUserInRoom(room, id, key, value)
    return users[id]
  }
  return undefined
}

module.exports = {
  userJoin,
  getUserById,
  userLeave,
  getUserByUsernameAndRoom,
  updateUser,
}
