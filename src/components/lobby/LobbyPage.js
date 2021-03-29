import React, { useContext, useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import { amber } from '@material-ui/core/colors'

import Context from '../../context/context'
import LobbyUsers from './LobbyUsers'
import Rules from '../reusable/Rules'

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(2),
    textAlign: 'center',
  },
  customWords: {
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
  textfields: {
    background: '#B2DAFF',
    borderRadius: '5px',
  },
  button: {
    backgroundColor: 'Transparent',
    backgroundRepeat: 'no-repeat',
    border: 'none',
    cursor: 'pointer',
    overflow: 'hidden',
    outline: 'none',
  },
  textContent: {
    float: 'left',
    width: '30%',
    background: 'white',
    height: '100vh',
    overflow: 'auto',
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  roomCode: {
    position: 'absolute',
    top: 0,
    left: 0,
    background: '#B2DAFF',
    border: '3px solid black',
    borderRadius: '5px',
    margin: theme.spacing(2),
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: amber[200],
    },
  },
  users: {
    float: 'right',
    width: '70%',
    // border: '5px solid black',
    height: '85vh',
    overflow: 'auto',
    marginTop: theme.spacing(5),
  },
}))

export default function LobbyPage() {
  const classes = useStyles()
  const history = useHistory()
  const globalContext = useContext(Context)
  const [isReady, setIsReady] = useState(false)
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState('copy room code to clipboard')
  const [customWord, setCustomWord] = useState('')
  const [numOfCustomWords, setNumOfCustomWords] = useState(0)
  const [wordsNeeded, setWordsNeeded] = useState(0)
  const [totalRounds, setTotalRounds] = useState(3)

  const handleRoomUsers = (data) => {
    if (Object.keys(data.users).length < 3) {
      setMessage('You need at least 3 players to start!')
    } else {
      setMessage('')
    }
    globalContext.socket.emit('totalRounds', { totalRounds: parseInt(totalRounds, 10) })
  }

  const handleRoomCode = () => {
    navigator.clipboard.writeText(globalContext.roomCode)
    setCopied('room code copied')
  }

  const handleCustomWords = () => {
    console.log('before emitting custom')
    globalContext.socket.emit('addCustom', { customWord })
    console.log('after emitting custom')
  }

  const handleTotalRounds = (e) => {
    setTotalRounds(e.target.value, 10)
  }

  const sendTotalRounds = () => {
    globalContext.socket.emit('totalRounds', { totalRounds: parseInt(totalRounds, 10) })
  }

  useEffect(() => {
    if (!globalContext.roomCode || !globalContext.socket) {
      history.push('/')
      return () => {}
    }
    globalContext.socket.once('everyoneReady', () => {
      history.push('/game')
    })

    globalContext.socket.on('numCustomWords', (data) => {
      setNumOfCustomWords(data)

      if (data === 0 || data === 1) {
        setWordsNeeded(2 - data)
      } else {
        setWordsNeeded(0)
      }
    })

    globalContext.socket.on('totalRounds', (data) => {
      setTotalRounds(data)
    })

    globalContext.socket.on('roomUsers', handleRoomUsers)
    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      globalContext.socket.off('roomUsers', handleRoomUsers)
    }
  }, [])

  const handleReady = async (event) => {
    event.preventDefault()
    try {
      if (isReady) {
        globalContext.socket.emit('notReady', globalContext.socket.id)
      } else {
        globalContext.socket.emit('ready', { totalRounds: parseInt(totalRounds, 10) })
      }

      await new Promise((resolve) => {
        globalContext.socket.once('roomUsers', async (data) => {
          resolve(data)
        })
      })

      setIsReady(!isReady)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={classes.root}>
      <Rules />
      <div className={classes.textContent}>
        <Typography>{message}</Typography>
        <button className={classes.button} type="button" onClick={handleRoomCode}>
          <div className={classes.roomCode}>
            <Typography variant="h4">
              Roomcode:
              {'  '}
              {globalContext.roomCode}
            </Typography>
            <Typography variant="subtitle2">{copied}</Typography>
          </div>
        </button>
        {globalContext.customWords && (
          <form
            action="."
            onSubmit={(e) => {
              e.preventDefault()
              handleCustomWords(customWord)
              setCustomWord('')
            }}
          >
            <Typography className={classes.margin}>
              {`Total number of custom words: ${numOfCustomWords}`}
            </Typography>
            <div className={classes.customWords}>
              <TextField
                label="Enter custom words"
                variant="outlined"
                value={customWord}
                onChange={(e) => setCustomWord(e.target.value)}
                className={classes.textfields}
                inputProps={{
                  maxLength: 25,
                  pattern: '^[a-zA-Z0-9 ]*$',
                }}
              />
              <Typography variant="h8">
                Words can only contain 25 or less alphanumeric characters.
              </Typography>
            </div>
          </form>
        )}
        <form
          action="."
          onSubmit={(e) => {
            e.preventDefault()
            sendTotalRounds()
          }}
        >
          {globalContext.isHost ? (
            <div className={classes.customWords}>
              <TextField
                label="Number of rounds"
                defaultValue="3"
                variant="outlined"
                value={totalRounds}
                onChange={(e) => handleTotalRounds(e)}
                className={classes.textfields}
                inputProps={{
                  maxLength: 1,
                  pattern: '^[1-6]$',
                }}
              />
              <Typography variant="h8">Number of rounds (1-6)</Typography>
            </div>
          ) : null}
          <Typography variant="h8">
            Total Rounds:
            {totalRounds}
          </Typography>
        </form>
        {numOfCustomWords !== 1 ? (
          <Typography variant="h5" className={classes.margin}>
            Game starts when everyone is ready
          </Typography>
        ) : (
          <>
            <Typography variant="h8" className={classes.margin}>
              {`The lobby needs ${wordsNeeded} more custom word to start game`}
            </Typography>
            <Typography variant="h5" className={classes.margin}>
              Game starts when players and words are ready
            </Typography>
          </>
        )}
        <Button
          className={classes.margin}
          variant="contained"
          color="primary"
          size="large"
          onClick={handleReady}
        >
          {isReady ? `I'm no longer ready :(` : `I'm ready`}
        </Button>
        <Typography variant="h6" className={classes.margin}>
          {Object.values(globalContext.users).length}
          {'    '}
          Players
        </Typography>
      </div>
      <div className={classes.users}>{globalContext.socket && <LobbyUsers />}</div>
    </div>
  )
}
