import React, { useContext, useState } from 'react'
import Button from '@material-ui/core/Button'
// import Form from '@material-ui/core/Form'
import TextField from '@material-ui/core/TextField'
import { useHistory } from 'react-router-dom'
import io from 'socket.io-client'
import Context from '../../context/context'

export default function HomePage() {
  const globalContext = useContext(Context)
  const history = useHistory()
  const [code, setCode] = useState('')

  const handleRoomCode = (e) => {
    console.log(code)
    setCode(e.target.value)
  }

  const handleJoin = async (event) => {
    event.preventDefault()
    try {
      const socket = io.connect('ws://localhost:8080')
      console.log('made socket')
      socket.emit('joinRoom', { username: 'Lord Slug', room: code })
      console.log('joined room?')
      globalContext.addSocket(socket, globalContext)
      console.log('socket stuff over')
      history.push('/game')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h1>Picture Imperfect</h1>
      <Button color="secondary" href="/create">
        Create Game
      </Button>
      <form onSubmit={handleJoin}>
        <TextField
          id="outlined-basic"
          label="Enter room code"
          variant="outlined"
          onChange={(e) => handleRoomCode(e)}
        />
        <Button type="submit">Join Game</Button>
      </form>
    </div>
  )
}
