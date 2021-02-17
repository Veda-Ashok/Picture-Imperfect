import React, { useContext, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'

import Context from '../../context/context'
import LobbyUsers from './LobbyUsers'
import Rules from '../reusable/Rules'

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(2),
    textAlign: 'center',
  },
  textfields: {
    margin: theme.spacing(2),
    background: '#B2DAFF',
    borderRadius: '5px',
  },
  textContent: {
    float: 'left',
    width: '30%',
    // border: '5px solid black',
    background: 'white',
    height: '100vh',
    overflow: 'auto',
    // marginTop: theme.spacing(15),
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'center',
    // flexDirection: 'row',
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
  },
  users: {
    float: 'right',
    width: '70%',
    // border: '5px solid black',
    height: '80vh',
    overflow: 'auto',
    marginTop: theme.spacing(15),
  },
}))

export default function LobbyPage() {
  const classes = useStyles()
  const history = useHistory()
  const globalContext = useContext(Context)

  useEffect(() => {
    if (!globalContext.roomCode || !globalContext.socket) {
      history.push('/')
    }
  }, [])

  const handleReady = async (event) => {
    event.preventDefault()
    try {
      console.log(globalContext.myInfo.username)
      globalContext.socket.emit('ready', globalContext.socket.id)

      await new Promise((resolve) => {
        globalContext.socket.once('everyoneReady', async (data) => {
          resolve(data)
        })
      })
      history.push('/game')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={classes.root}>
      <Rules />
      <div className={classes.textContent}>
        <Typography variant="h4" className={classes.roomCode}>
          Roomcode:
          {'  '}
          {globalContext.roomCode}
        </Typography>
        {globalContext.customWords && (
          <TextField
            label="Enter custom words"
            variant="outlined"
            onChange={() => alert('add Custom Words')}
            className={classes.textfields}
          />
        )}
        <Typography variant="h5" className={classes.margin}>
          Game starts when everyone is ready
        </Typography>
        <Button
          className={classes.margin}
          variant="contained"
          color="primary"
          size="large"
          onClick={handleReady}
        >
          Ready
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
