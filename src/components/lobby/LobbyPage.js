import React, { useContext } from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
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
    background: 'white',
    borderRadius: '5px',
  },
  textContent: {
    float: 'left',
    width: '30%',
    // border: '5px solid black',
    height: '80vh',
    overflow: 'auto',
    marginTop: theme.spacing(15),
    display: 'flex',
    flexFlow: 'column wrap',
    justifyContent: 'center',
    // flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  roomCode: {
    position: 'absolute',
    top: 0,
    left: 0,
    background: 'white',
    border: '3px solid black',
    borderRadius: '5px',
    margin: theme.spacing(2),
    padding: theme.spacing(2),
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
  const globalContext = useContext(Context)

  return (
    <div className={classes.root}>
      <Rules />
      <Typography variant="h4" className={classes.roomCode}>
        Roomcode:
        {'  '}
        {globalContext.roomCode}
      </Typography>
      <div className={classes.textContent}>
        {globalContext.customWords && (
          <TextField
            label="Enter custom words"
            variant="outlined"
            onChange={() => alert('add Custom Words')}
            className={classes.textfields}
          />
        )}
        <Typography variant="h4" className={classes.margin}>
          Everyone ready?
        </Typography>
        <Button
          className={classes.margin}
          variant="contained"
          color="primary"
          size="large"
          onClick={() => alert('start game')}
        >
          Start Game
        </Button>
        <Typography variant="h6" className={classes.margin}>
          {Object.values(globalContext.users).length}
          {'    '}
          Players
        </Typography>
      </div>
      <div className={classes.users}>
        <LobbyUsers />
      </div>
    </div>
  )
}
