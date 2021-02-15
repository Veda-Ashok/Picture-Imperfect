export const ADD_SOCKET = 'ADD_SOCKET'
export const ADD_ROOM_CODE = 'ADD_ROOM_CODE'
export const UPDATE_USERS = 'UPDATE_USERS'
export const UPDATE_CUSTOM_WORDS = 'UPDATE_CUSTOM_WORDS'

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

const updateCustomWords = (customWords, state) => {
  return { ...state, customWords }
}

export const pictureImperfectReducer = (state, action) => {
  switch (action.type) {
    case ADD_SOCKET:
      return addSocket(action.socket, state)
    case ADD_ROOM_CODE:
      return addRoomCode(action.roomCode, state)
    case UPDATE_USERS:
      return updateUsers(action.users, state)
    case UPDATE_CUSTOM_WORDS:
      return updateCustomWords(action.customWords, state)
    default:
      return state
  }
}
