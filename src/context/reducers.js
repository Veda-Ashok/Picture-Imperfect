export const ADD_SOCKET = 'ADD_SOCKET'
export const ADD_ROOM_CODE = 'ADD_ROOM_CODE'
export const UPDATE_USERS = 'UPDATE_USERS'
export const UPDATE_MY_INFO = 'UPDATE_MY_INFO'
export const UPDATE_CUSTOM_WORDS = 'UPDATE_CUSTOM_WORDS'
export const UPDATE_SCREENSHOT = 'UPDATE_SCREENSHOT'
export const UPDATE_IS_HOST = 'UPDATE_IS_HOST'

const addSocket = (socket, state) => {
  return { ...state, socket }
}

const addRoomCode = (roomCode, state) => {
  return { ...state, roomCode }
}

const updateUsers = (users, state) => {
  return { ...state, users }
}

const updateCustomWords = (customWords, state) => {
  return { ...state, customWords }
}

const updateMyInfo = (myInfo, state) => {
  return { ...state, myInfo }
}

const updateScreenshot = (screenshot, state) => {
  return { ...state, screenshot }
}

const updateIsHost = (isHost, state) => {
  return { ...state, isHost }
}

export const pictureImperfectReducer = (state, action) => {
  switch (action.type) {
    case ADD_SOCKET:
      return addSocket(action.socket, state)
    case ADD_ROOM_CODE:
      return addRoomCode(action.roomCode, state)
    case UPDATE_USERS:
      return updateUsers(action.users, state)
    case UPDATE_MY_INFO:
      return updateMyInfo(action.myInfo, state)
    case UPDATE_SCREENSHOT:
      return updateScreenshot(action.screenshot, state)
    case UPDATE_CUSTOM_WORDS:
      return updateCustomWords(action.customWords, state)
    case UPDATE_IS_HOST:
      return updateIsHost(action.isHost, state)
    default:
      return state
  }
}
