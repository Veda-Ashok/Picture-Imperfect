import React, { useContext, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Context from '../../context/context'

export default function LobbyUsers() {
  const globalContext = useContext(Context)
  const { socket } = globalContext

  const handleUserUpdate = (data) => {
    const { users } = data
    globalContext.updateUsers(users, globalContext)
  }

  useEffect(() => {
    // subscribe to socket events
    socket.on('roomUsers', handleUserUpdate)

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off('roomUsers', handleUserUpdate)
    }
  }, [socket, handleUserUpdate])

  return (
    <div>
      <Typography>
        {Object.values(globalContext.users).map((user) => {
          return (
            <div>
              <Avatar src={user.icon} alt={user.username} />
              <Typography>{user.username}</Typography>
            </div>
          )
        })}
      </Typography>
    </div>
  )
}
