import React, { useContext, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Context from '../../context/context'
import Chatbox from './Chatbox'
import Rules from '../reusable/Rules'
import Board from './Board'

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
  const [timer, setTimer] = useState(0)
  const [blueTeamWord, setBlueTeamWord] = useState('')
  const [whiteTeamWord, setWhiteTeamWord] = useState('')

  // const socketRef = useRef()

  useEffect(() => {
    if (!globalContext.roomCode || !globalContext.socket) {
      history.push('/')
      return () => {}
    }
    // socketRef.current = globalContext.socket
    globalContext.socket.on('roomRoles', (data) => {
      setBlueTeam(data.blueTeam)
      setWhiteTeam(data.whiteTeam)
      setJudges(Object.values(data.judges))
    })
    globalContext.socket.on('newDrawers', (data) => {
      setBlueTeam(data.blueTeam)
      setWhiteTeam(data.whiteTeam)
    })
    globalContext.socket.on('roundTimer', (data) => {
      setTimer(data.timeRemaining)
    })
    globalContext.socket.on('wordAssignment', (data) => {
      setBlueTeamWord(data.blueTeamWord)
      setWhiteTeamWord(data.whiteTeamWord)
    })

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
    }
  }, [])

  return (
    <div className={classes.root}>
      <Board />
      <Rules />
      <div className={classes.banner}>
        <Typography variant="h2"> v.s </Typography>
      </div>
      <div className={classes.content}>
        <div>
          <Typography>
            Timer:
            {timer}
          </Typography>
        </div>
        <Typography>
          White Team:
          {whiteTeamWord}
        </Typography>
        {whiteTeam.length > 0 &&
          whiteTeam.map((player) => (
            <div key={player.username}>
              <Avatar src={player.icon ? player.icon : '/logo192.png'} alt={player.username} />
              <Typography variant="subtitle1">{player.username}</Typography>
            </div>
          ))}
        <Typography>
          Blue Team:
          {blueTeamWord}
        </Typography>
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
