import React, { useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'

import Context from '../../context/context'
import Chatbox from './Chatbox'
import Rules from '../reusable/Rules'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
  },
  chatBox: {
    border: '3px solid black',
    margin: theme.spacing(1),
  },
}))

export default function GamePage() {
  const classes = useStyles()
  const history = useHistory()
  const globalContext = useContext(Context)

  useEffect(() => {
    if (!globalContext.roomCode || !globalContext.socket) {
      history.push('/')
    }

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
    }
  }, [])

  return (
    <div className={classes.root}>
      <Rules />
      <div className={classes.chatBox}>{globalContext.socket && <Chatbox />}</div>
    </div>
  )
}
