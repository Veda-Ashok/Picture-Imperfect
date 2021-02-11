import React, { useContext, useState } from 'react'
import Button from '@material-ui/core/Button'
// import Form from '@material-ui/core/Form'
import TextField from '@material-ui/core/TextField'
import { useHistory } from 'react-router-dom'
import io from 'socket.io-client'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import Context from '../../context/context'

export default function HomePage() {
  const globalContext = useContext(Context)
  const history = useHistory()
  const [roomCode, setRoomCode] = useState(undefined)
  const [openCreateGame, setOpenCreateGame] = useState(false)
  const [openJoinGame, setOpenJoinGame] = useState(false)

  const handleRoomCode = (e) => {
    console.log(roomCode)
    setRoomCode(e.target.value)
  }

  const handleCreateGameOpen = () => {
    setOpenCreateGame(true)
  }

  const handleJoinGameOpen = () => {
    setOpenJoinGame(true)
  }

  const handleCreateGameClose = () => {
    setOpenCreateGame(false)
  }

  const handleJoinGameClose = () => {
    setOpenJoinGame(false)
  }

  const handleJoin = async (event) => {
    event.preventDefault()
    try {
      const socket = io.connect('ws://localhost:8080')
      console.log('made socket')
      socket.emit('joinRoom', { username: 'Lord Slug', room: roomCode })
      console.log('joined room?')
      // need to check if the roomcode exists
      globalContext.addRoomCode(roomCode, globalContext)
      globalContext.addSocket(socket, globalContext)
      console.log('socket stuff over')
      history.push('/lobby')
    } catch (error) {
      console.log(error)
    }
  }

  // const onRoomUsers = (data) => {
  //   console.log('onRoomUsers', data)
  //   console.log('onRoomUsers data.room', data.room)
  //   setRoomCode(data.room)
  //   // data.users
  // }

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      let room
      const socket = io.connect('ws://localhost:8080')
      console.log('made socket')
      // TODO: Create room function
      socket.emit('createRoom', { username: 'Creation Slug', customWords: true })

      await new Promise((resolve) => {
        socket.on('roomUsers', async (data) => {
          console.log('onRoomUsers', data)
          console.log('onRoomUsers data.room', data.room)
          room = data.room
          resolve(data)
        })
      })
      console.log('room code before global state: ', room)

      globalContext.addRoomCode(room, globalContext)
      console.log('created room?')
      globalContext.addSocket(socket, globalContext)
      console.log('socket stuff over')
      console.log('room code after global state: ', room)

      history.push('/lobby')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h1>Picture Imperfect</h1>

      <Button variant="contained" color="secondary" onClick={handleCreateGameOpen}>
        Create Game
      </Button>

      <Button variant="contained" onClick={handleJoinGameOpen}>
        Join Game
      </Button>

      <Dialog onClose={handleCreateGameClose} aria-labelledby="create-game" open={openCreateGame}>
        <form onSubmit={handleCreate}>
          <DialogTitle id="create-game-title">Create Game</DialogTitle>
          <Button variant="contained" color="secondary" type="submit" onClick={handleCreate}>
            Create Game
          </Button>
        </form>
      </Dialog>

      <Dialog onClose={handleJoinGameClose} aria-labelledby="create-game" open={openJoinGame}>
        <form onSubmit={handleJoin}>
          <DialogTitle id="create-game-title">Join Game</DialogTitle>
          <TextField
            id="outlined-basic"
            label="Enter room code"
            variant="outlined"
            onChange={(e) => handleRoomCode(e)}
          />
          <Button variant="contained" color="secondary" type="submit" onClick={handleJoin}>
            Join Game
          </Button>
        </form>
      </Dialog>
    </div>
  )
}
