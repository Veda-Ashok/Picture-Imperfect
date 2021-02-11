export const ADD_SOCKET = 'ADD_SOCKET'
export const ADD_ROOM_CODE = 'ADD_ROOM_CODE'

const addSocket = (socket, state) => {
  return { ...state, socket }
}

const addRoomCode = (roomCode, state) => {
  return { ...state, roomCode }
}

export const pictureImperfectReducer = (state, action) => {
  switch (action.type) {
    case ADD_SOCKET:
      return addSocket(action.socket, state)
    case ADD_ROOM_CODE:
      return addRoomCode(action.roomCode, state)
    default:
      return state
  }
}
