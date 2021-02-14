export const ADD_SOCKET = 'ADD_SOCKET'
export const ADD_ROOM_CODE = 'ADD_ROOM_CODE'
export const UPDATE_USERS = 'UPDATE_USERS'

const addSocket = (socket, state) => {
  return { ...state, socket }
}

const addRoomCode = (roomCode, state) => {
  return { ...state, roomCode }
}
//  check if the spread is ok
const updateUsers = (users, state) => {
  // console.log('current users in state: ', state.users)
  // console.log('users: ', users)
  // const updatedUsers = { ...state.users, ...users }
  // console.log('new users ', updatedUsers)
  return { ...state, users }
}

export const pictureImperfectReducer = (state, action) => {
  switch (action.type) {
    case ADD_SOCKET:
      return addSocket(action.socket, state)
    case ADD_ROOM_CODE:
      return addRoomCode(action.roomCode, state)
    case UPDATE_USERS:
      return updateUsers(action.users, state)
    default:
      return state
  }
}
