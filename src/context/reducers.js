export const ADD_SOCKET = 'ADD_SOCKET'
export const ADD_ROOM_CODE = 'ADD_ROOM_CODE'
export const ADD_USERS = 'ADD_USERS'

const addSocket = (socket, state) => {
  return { ...state, socket }
}

const addRoomCode = (roomCode, state) => {
  return { ...state, roomCode }
}
//  check if the spread is ok
const addUsers = (users, state) => {
  const updatedUsers = { ...state.users, ...users }
  return { ...state, updatedUsers }
}

export const pictureImperfectReducer = (state, action) => {
  switch (action.type) {
    case ADD_SOCKET:
      return addSocket(action.socket, state)
    case ADD_ROOM_CODE:
      return addRoomCode(action.roomCode, state)
    case ADD_USERS:
      return addUsers(action.users, state)
    default:
      return state
  }
}
