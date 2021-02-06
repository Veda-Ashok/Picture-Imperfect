const users = []

function userJoin(id, username, room) {
  const user = { id, username, room }
  users.push(user)
  return user
}

function getUserById(id) {
  return users.find((user) => user.id === id)
}

function userLeave(id) {
  const index = users.findIndex((user) => user.id === id)

  if (index === -1) {
    // throw `Error: user with id ${id} not in list`
    return id
  }
  return users.splice(index, 1)[0]
}

function getRoomUsers(room) {
  return users.filter((user) => user.room === room)
}

module.exports = {
  userJoin,
  getUserById,
  userLeave,
  getRoomUsers,
}
