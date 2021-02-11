import React, { useContext, useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
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
  const [username, setUsername] = useState(undefined)
  const [command, setCommand] = useState(undefined)
  const [usernameError, setUsernameError] = useState('')
  const [customWords, setCustomWords] = useState(false)
  const [openCreateGame, setOpenCreateGame] = useState(false)
  const [openJoinGame, setOpenJoinGame] = useState(false)
  const [openUsernameError, setOpenUsernameError] = useState(false)

  // if they are in a room right now remove them from the room
  useEffect(() => {
    if (globalContext.roomCode) {
      globalContext.addRoomCode(undefined, globalContext)
      globalContext.socket.emit('disconnect')
    }
  }, [])

  // Room handlers
  const handleRoomCode = (e) => {
    console.log(roomCode)
    setRoomCode(e.target.value)
  }

  const handleCreateGameOpen = () => {
    setCommand('createRoom')
    setOpenCreateGame(true)
  }

  const handleCreateGameClose = () => {
    setCommand('')
    setOpenCreateGame(false)
  }

  const handleJoinGameOpen = () => {
    setCommand('joinRoom')
    setOpenJoinGame(true)
  }

  const handleJoinGameClose = () => {
    setCommand('')
    setOpenJoinGame(false)
  }

  // Username handlers
  const handleUsername = (e) => {
    console.log('username', username)
    setUsername(e.target.value)
  }

  const handleUsernameErrorOpen = () => {
    setUsername(undefined)
    setOpenUsernameError(true)
  }

  const handleUsernameErrorClose = () => {
    setOpenUsernameError(false)
  }

  const goToRoom = async (event) => {
    event.preventDefault()
    if (username === undefined) {
      handleUsernameErrorOpen()
      setUsernameError('Please enter a username')
    } else {
      try {
        let room
        let socket
        const usernameTaken = true
        if (!globalContext.socket) {
          socket = io.connect('ws://localhost:8080')
          console.log('made socket')
          globalContext.addSocket(socket, globalContext)
        } else {
          socket = globalContext.socket
        }
        // we need a socket command to check username
        // usernameTaken = data.usernameTaken
        if (usernameTaken) {
          handleUsernameErrorOpen()
          setUsernameError('Sorry that username is taken')
        } else {
          if (command === 'createRoom') {
            socket.emit(command, { username, customWords })
          } else if (command === 'joinRoom') {
            socket.emit('joinRoom', { username, room: roomCode })
          }
          await new Promise((resolve) => {
            socket.on('roomUsers', async (data) => {
              console.log('onRoomUsers data.room', data.room)
              room = data.room
              resolve(data)
            })
          })

          globalContext.addRoomCode(room, globalContext)
          history.push('/lobby')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleCustomWords = (event) => {
    setCustomWords(event.target.checked)
  }

  return (
    <div>
      <h1>Picture Imperfect</h1>

      <img src="/logo192.png" alt="logo" />

      <Button variant="contained" color="secondary" onClick={handleCreateGameOpen}>
        Create Game
      </Button>

      <Button variant="contained" onClick={handleJoinGameOpen}>
        Join Game
      </Button>

      <Dialog
        onClose={handleUsernameErrorClose}
        aria-labelledby="username-error"
        open={openUsernameError}
      >
        <DialogTitle>{usernameError}</DialogTitle>
      </Dialog>

      <Dialog onClose={handleCreateGameClose} aria-labelledby="create-game" open={openCreateGame}>
        <DialogTitle id="create-game-title">Create Game</DialogTitle>
        <form onSubmit={goToRoom}>
          <TextField
            id="outlined-basic"
            label="Enter username"
            variant="outlined"
            onChange={(e) => handleUsername(e)}
          />
          <FormControlLabel
            /* eslint-disable */
            control={
              <Checkbox
                checked={customWords}
                onChange={handleCustomWords}
                name="custom-words-checkbox"
              />
            }
            /* eslint-disable */
            label="Add your own custom words?"
          />
          <Button variant="contained" color="secondary" type="submit">
            Create Game
          </Button>
        </form>
      </Dialog>

      <Dialog onClose={handleJoinGameClose} aria-labelledby="join-game" open={openJoinGame}>
        <DialogTitle id="create-game-title">Join Game</DialogTitle>
        <form onSubmit={goToRoom}>
          <TextField
            id="outlined-basic"
            label="Enter room code"
            variant="outlined"
            onChange={(e) => handleRoomCode(e)}
          />
          <TextField
            id="outlined-basic"
            label="Enter username"
            variant="outlined"
            onChange={(e) => handleUsername(e)}
          />
          <Button variant="contained" color="secondary" type="submit">
            Join Game
          </Button>
        </form>
      </Dialog>
    </div>
  )
}
