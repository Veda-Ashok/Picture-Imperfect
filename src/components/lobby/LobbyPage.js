import React, { useContext } from 'react'
import Context from '../../context/context'

export default function LobbyPage() {
  const globalContext = useContext(Context)
  return (
    <div>
      <h1>Lobby Page</h1>
      <p>{globalContext.roomCode}</p>
    </div>
  )
}
