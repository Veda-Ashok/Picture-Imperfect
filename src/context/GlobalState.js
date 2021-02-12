import React, { useReducer } from 'react'
import PropTypes from 'prop-types'
import Context from './context'
import { pictureImperfectReducer, ADD_SOCKET, ADD_ROOM_CODE, ADD_USERS } from './reducers'

const GlobalState = (props) => {
  const { children } = props
  const [appState, dispatch] = useReducer(pictureImperfectReducer, {
    socket: undefined,
    roomCode: undefined,
    users: {},
  })

  const addSocket = (socket) => {
    dispatch({ type: ADD_SOCKET, socket })
  }

  const addRoomCode = (roomCode) => {
    dispatch({ type: ADD_ROOM_CODE, roomCode })
  }

  const addUsers = (users) => {
    dispatch({ type: ADD_USERS, users })
  }

  return (
    <Context.Provider
      value={{
        socket: appState.socket,
        addSocket,
        roomCode: appState.roomCode,
        addRoomCode,
        users: appState.users,
        addUsers,
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
