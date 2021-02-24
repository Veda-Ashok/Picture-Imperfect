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
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
  },
  chatBox: {
    width: '30%',
    // border: '3px solid black',
    margin: theme.spacing(1),
  },
  banner: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
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
      setJudges(Object.values(data.judges))
      console.log(Object.values(data.judges))
    })

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
    }
  }, [])

  return (
    <div className={classes.root}>
      <Rules />
      <div className={classes.banner}>
        <Typography variant="h2"> v.s </Typography>
      </div>
      <div className={classes.content}>
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
        <div className={classes.chatBox}>
          {globalContext.socket && judges.length > 0 && <Chatbox judges={judges} />}
        </div>
      </div>
    </div>
  )
}
