import React, { useContext } from 'react'
import Typography from '@material-ui/core/Typography'
import Context from '../../context/context'

export default function LobbyPage() {
  const globalContext = useContext(Context)
  return (
    <div>
      <Typography variant="h2">Lobby Page</Typography>
      <Typography>{globalContext.roomCode}</Typography>
    </div>
  )
}
