import React, { useContext } from 'react'
import Typography from '@material-ui/core/Typography'
import Context from '../../context/context'
import LobbyUsers from './LobbyUsers'

export default function LobbyPage() {
  const globalContext = useContext(Context)

  return (
    <div>
      {console.log('rendering')}
      <Typography variant="h2">Lobby Page</Typography>
      <Typography>{globalContext.roomCode}</Typography>
      <LobbyUsers />
    </div>
  )
}
