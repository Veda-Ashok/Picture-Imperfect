import React, { useContext, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
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
  const [blueTeam, setBlueTeam] = useState([])
  const [whiteTeam, setWhiteTeam] = useState([])
  const [judges, setJudges] = useState([])

  useEffect(() => {
    if (!globalContext.roomCode || !globalContext.socket) {
      history.push('/')
      return () => {}
    }
    globalContext.socket.on('roomRoles', (data) => {
      setBlueTeam(data.blueTeam)
      setWhiteTeam(data.whiteTeam)
      setJudges(Object.keys(data.judges))
    })

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
    }
  }, [])

  return (
    <div className={classes.root}>
      <Typography>White Team</Typography>
      {whiteTeam.length > 0 &&
        whiteTeam.map((player) => (
          <div key={player.username}>
            <Avatar src={player.icon ? player.icon : '/logo192.png'} alt={player.username} />
            <Typography variant="subtitle1">{player.username}</Typography>
          </div>
        ))}
      <Typography>Blue Team</Typography>
      {blueTeam.length > 0 &&
        blueTeam.map((player) => (
          <div key={player.username}>
            <Avatar src={player.icon ? player.icon : '/logo192.png'} alt={player.username} />
            <Typography variant="subtitle1">{player.username}</Typography>
          </div>
        ))}
      <Rules />
      <div className={classes.chatBox}>
        {globalContext.socket && judges.length > 0 && <Chatbox judges={judges} />}
      </div>
    </div>
  )
}
