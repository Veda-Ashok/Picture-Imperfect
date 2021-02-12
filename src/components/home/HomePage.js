import React, { useContext, useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import DialogContent from '@material-ui/core/DialogContent'
import { useHistory } from 'react-router-dom'
import io from 'socket.io-client'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import { makeStyles } from '@material-ui/core/styles'
import Context from '../../context/context'

const useStyles = makeStyles((theme) => ({
  body: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
  },
  dialog: {
    margin: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  img: {
    maxWidth: '192px',
  },
  buttons: {
    margin: theme.spacing(5),
  },
  button: {
    margin: theme.spacing(2),
  },
  textfields: {
    margin: theme.spacing(2.5),
  },
}))

export default function HomePage() {
  const classes = useStyles()
  const globalContext = useContext(Context)
  const history = useHistory()
  const [roomCode, setRoomCode] = useState(undefined)
  const [username, setUsername] = useState(undefined)
  const [command, setCommand] = useState(undefined)
  const [errorMessage, setErrorMessage] = useState('')
  const [customWords, setCustomWords] = useState(false)
  const [openCreateGame, setOpenCreateGame] = useState(false)
  const [openJoinGame, setOpenJoinGame] = useState(false)
  const [openError, setOpenError] = useState(false)

  // if they are in a room right now remove them from the room
  useEffect(() => {
    if (globalContext.roomCode) {
      globalContext.socket.emit('disconnect')
      globalContext.addRoomCode(undefined, globalContext)
      globalContext.addSocket(undefined, globalContext)
    }
  }, [])

  // Room handlers
  const handleRoomCode = (e) => {
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
    setUsername(e.target.value)
  }

  const handleErrorOpen = () => {
    setOpenError(true)
  }

  const handleErrorClose = () => {
    setOpenError(false)
  }

  const goToRoom = async (event) => {
    console.log('Going to room')
    event.preventDefault()
    if ((roomCode === undefined || roomCode.length < 1) && command === 'joinRoom') {
      // Throw error if they dont input a room code
      setErrorMessage('Please input a room code!')
      handleErrorOpen()
    } else if (username === undefined || username.length < 1) {
      setErrorMessage('Please enter a username!')
      handleErrorOpen()
    } else {
      try {
        let room
        let socket
        let users
        let usernameTaken = false
        let invalidRoom = false
        // const roomExist = false
        console.log('before checking if socket already exists')
        if (!globalContext.socket) {
          socket = io.connect('ws://localhost:8080')
          console.log('made socket')
          globalContext.addSocket(socket, globalContext)
        } else {
          console.log('elrkjnwelrnf;worhupij')
          socket = globalContext.socket
        }
        // we need a socket command to check username
        // usernameTaken = data.usernameTaken
        if (command === 'createRoom') {
          socket.emit(command, { username, customWords })
        } else if (command === 'joinRoom') {
          socket.emit('joinRoom', { username, room: roomCode })
        }

        console.log('promises')
        await new Promise((resolve) => {
          socket.on('invalidRoomCode', async (data) => {
            console.log('checking validity', data)
            invalidRoom = true
            setErrorMessage(`Sorry, ${roomCode} is invalid! Please enter a different code.`)
            handleErrorOpen()
            resolve(data)
          })
          socket.on('invalidUsername', async (data) => {
            console.log('checking validity', data)
            usernameTaken = true
            setErrorMessage(`Sorry ${username} is already taken in the lobby`)
            handleErrorOpen()
            resolve(data)
          })
          socket.on('roomUsers', async (data) => {
            console.log('onRoomUsers data.room', data.room)
            room = data.room
            users = data.users
            console.log('user from t server', users)
            resolve(data)
          })
        })

        if (!usernameTaken && !invalidRoom) {
          // await new Promise((resolve) => {
          //   socket.on('roomUsers', async (data) => {
          //     console.log('onRoomUsers data.room', data.room)
          //     room = data.room
          //     resolve(data)
          //   })
          // })

          globalContext.addRoomCode(room, globalContext)
          globalContext.addUsers(users, globalContext)
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
    <div className={classes.body}>
      <Typography variant="h1">Picture</Typography>

      <img className={classes.img} src="/logo192.png" alt="logo" />

      <Typography variant="h1">Imperfect</Typography>

      <span className={classes.buttons}>
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleCreateGameOpen}
        >
          Create Game
        </Button>

        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleJoinGameOpen}
        >
          Join Game
        </Button>
      </span>

      <Dialog
        onClose={handleErrorClose}
        aria-labelledby="error"
        open={openError}
        className={classes.dialog}
      >
        <DialogTitle>{errorMessage}</DialogTitle>
      </Dialog>

      <Dialog onClose={handleCreateGameClose} aria-labelledby="create-game" open={openCreateGame}>
        <form onSubmit={goToRoom}>
          <DialogTitle id="create-game-title">Create Game</DialogTitle>
          <DialogContent dividers className={classes.dialog}>
            <TextField
              id="outlined-basic"
              label="Enter username"
              variant="outlined"
              onChange={(e) => handleUsername(e)}
              className={classes.textfields}
            />
            <FormControlLabel
              /* eslint-disable */
              control={
                <Checkbox
                  checked={customWords}
                  onChange={handleCustomWords}
                  color="primary"
                  name="custom-words-checkbox"
                />
              }
              /* eslint-disable */
              label="Add your own custom words?"
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" type="submit">
              Create Game
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog onClose={handleJoinGameClose} aria-labelledby="join-game" open={openJoinGame}>
        <form onSubmit={goToRoom}>
          <DialogTitle id="create-game-title">Join Game</DialogTitle>
          <DialogContent dividers className={classes.dialog}>
            <TextField
              id="outlined-basic"
              label="Enter room code"
              variant="outlined"
              className={classes.textfields}
              onChange={(e) => handleRoomCode(e)}
            />
            <TextField
              id="outlined-basic"
              label="Enter username"
              variant="outlined"
              className={classes.textfields}
              onChange={(e) => handleUsername(e)}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" type="submit">
              Join Game
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}
