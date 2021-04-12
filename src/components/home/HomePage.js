import React, { useContext, useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
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
import IconBoard from './IconBoard'
import Rules from '../reusable/Rules'

// git push heroku heroku-deployment:main

let y = 1
y = 5

const useStyles = makeStyles((theme) => ({
  body: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
  },
  dialog: {
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
    margin: theme.spacing(2),
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
  const [openCreateGame, setOpenCreateGame] = useState(false)
  const [openJoinGame, setOpenJoinGame] = useState(false)
  const [openError, setOpenError] = useState(false)
  const [icon, setIcon] = useState('')

  // if they are in a room right now remove them from the room
  useEffect(() => {
    if (globalContext.roomCode) {
      globalContext.addRoomCode(undefined, globalContext)
    } else if (globalContext.socket) {
      globalContext.socket.emit('manualDisconnect')
      globalContext.addSocket(undefined, globalContext)
    }
    globalContext.updateUsers({}, globalContext)
    globalContext.updateMyInfo({}, globalContext)
    globalContext.updateScreenshot(undefined, globalContext)
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
        if (!globalContext.socket) {
          // socket = io.connect(`ws://localhost:${process.env.PORT || 8080}`) // uncomment this to run locally
          socket = io() // comment this to run locally

          globalContext.addSocket(socket, globalContext)
        } else {
          socket = globalContext.socket
        }
        if (command === 'createRoom') {
          socket.emit(command, { username, icon })
          globalContext.updateIsHost(true)
        } else if (command === 'joinRoom') {
          socket.emit('joinRoom', { username, room: roomCode, icon })
        }

        await new Promise((resolve) => {
          socket.once('invalidRoomCode', async (data) => {
            invalidRoom = true
            setErrorMessage(data)
            handleErrorOpen()
            resolve(data)
          })
          socket.once('gameAlreadyStarted', async (data) => {
            invalidRoom = true
            setErrorMessage(data)
            handleErrorOpen()
            resolve(data)
          })
          socket.once('invalidUsername', async (data) => {
            usernameTaken = true
            setErrorMessage(data)
            handleErrorOpen()
            resolve(data)
          })
          socket.once('roomUsers', async (data) => {
            room = data.room
            users = data.users
            resolve(data)
          })
        })

        if (!usernameTaken && !invalidRoom) {
          globalContext.updateMyInfo({ username, icon }, globalContext)
          globalContext.updateUsers(users, globalContext)
          globalContext.addRoomCode(room, globalContext)
          history.push('/lobby')
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <div className={classes.body}>
      <Rules />
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
            <div className={classes.textfields}>
              <IconBoard setIcon={setIcon} />
            </div>
            <TextField
              label="Enter nickname"
              variant="outlined"
              onChange={(e) => handleUsername(e)}
              className={classes.textfields}
              inputProps={{
                maxLength: 25,
                pattern: '^[a-zA-Z0-9 ]*$',
              }}
            />
            <Typography variant="subtitle2">
              Words can only contain 25 or less alphanumeric characters.
            </Typography>
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
            <div className={classes.textfields}>
              <IconBoard setIcon={setIcon} />
            </div>
            <TextField
              label="Enter room code"
              variant="outlined"
              className={classes.textfields}
              onChange={(e) => handleRoomCode(e)}
            />
            <TextField
              label="Enter nickname"
              variant="outlined"
              className={classes.textfields}
              onChange={(e) => handleUsername(e)}
              inputProps={{
                maxLength: 25,
                pattern: '^[a-zA-Z0-9 ]*$',
              }}
            />
            <Typography variant="subtitle2">
              Words can only contain 25 or less alphanumeric characters.
            </Typography>
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
