export const ADD_SOCKET = 'ADD_SOCKET'

const addSocket = (socket, state) => {
  return { ...state, socket }
}

export const pictureImperfectReducer = (state, action) => {
  switch (action.type) {
    case ADD_SOCKET:
      return addSocket(action.socket, state)
    default:
      return state
  }
}
