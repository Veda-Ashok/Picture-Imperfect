import React, { useReducer } from 'react'
import PropTypes from 'prop-types'
import Context from './context'
import { pictureImperfectReducer, ADD_SOCKET } from './reducers'

const GlobalState = (props) => {
  const { children } = props
  const [appState, dispatch] = useReducer(pictureImperfectReducer, {
    socket: undefined,
  })

  const addSocket = (socket) => {
    dispatch({ type: ADD_SOCKET, socket })
  }

  return (
    <Context.Provider
      value={{
        socket: appState.socket,
        addSocket,
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
