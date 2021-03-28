import React, { useReducer } from 'react'
import PropTypes from 'prop-types'
import Context from './context'
import {
  pictureImperfectReducer,
  ADD_SOCKET,
  ADD_ROOM_CODE,
  UPDATE_USERS,
  UPDATE_MY_INFO,
  UPDATE_SCREENSHOT,
} from './reducers'

const GlobalState = (props) => {
  const { children } = props
  const [appState, dispatch] = useReducer(pictureImperfectReducer, {
    socket: undefined,
    roomCode: undefined,
    users: {},
    customWords: true,
    myInfo: {},
    screenshot: undefined,
  })

  const addSocket = (socket) => {
    dispatch({ type: ADD_SOCKET, socket })
  }

  const addRoomCode = (roomCode) => {
    dispatch({ type: ADD_ROOM_CODE, roomCode })
  }

  const updateUsers = (users) => {
    dispatch({ type: UPDATE_USERS, users })
  }

  const updateMyInfo = (myInfo) => {
    dispatch({ type: UPDATE_MY_INFO, myInfo })
  }

  const updateScreenshot = (screenshot) => {
    dispatch({ type: UPDATE_SCREENSHOT, screenshot })
  }

  return (
    <Context.Provider
      value={{
        socket: appState.socket,
        addSocket,
        roomCode: appState.roomCode,
        addRoomCode,
        users: appState.users,
        updateUsers,
        customWords: appState.customWords,
        myInfo: appState.myInfo,
        updateMyInfo,
        screenshot: appState.screenshot,
        updateScreenshot,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default GlobalState

GlobalState.propTypes = {
  children: PropTypes.node.isRequired,
}
