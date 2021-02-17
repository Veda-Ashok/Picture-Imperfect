import React, { useReducer } from 'react'
import PropTypes from 'prop-types'
import Context from './context'
import {
  pictureImperfectReducer,
  ADD_SOCKET,
  ADD_ROOM_CODE,
  UPDATE_USERS,
  UPDATE_CUSTOM_WORDS,
  UPDATE_MY_INFO,
} from './reducers'

const GlobalState = (props) => {
  const { children } = props
  const [appState, dispatch] = useReducer(pictureImperfectReducer, {
    socket: undefined,
    roomCode: undefined,
    users: {},
    customWords: true,
    myInfo: {},
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

  const updateCustomWords = (customWords) => {
    dispatch({ type: UPDATE_CUSTOM_WORDS, customWords })
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
        updateCustomWords,
        myInfo: appState.myInfo,
        updateMyInfo,
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
