/* eslint-disable no-nested-ternary */
import React, { useContext, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Context from '../../context/context'
import Chatbox from './Chatbox'
import Rules from '../reusable/Rules'
import Board from './Board'
import PlayerQueue from './PlayerQueue'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  whiteBg: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: 'white',
    zIndex: -900,
  },
  chatBox: {
    width: '30%',
    margin: theme.spacing(1),
  },
  queue: {
    width: '30%',
    margin: theme.spacing(1),
  },
  banner: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(3),
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
  },
  bannerElement: {
    display: 'flex',
    marginBottom: theme.spacing(1),
  },
  secondsRemaining: {
    paddingTop: theme.spacing(1.5),
    paddingLeft: theme.spacing(2),
  },
  board: {
    backgroundColor: 'white',
    border: 'solid 3px black',
    // height: 'px',
    // width: '854px',
    // flex: 'none',
    // position: 'relative',
  },
  avatars: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  vs: {
    paddingRight: theme.spacing(5),
    paddingLeft: theme.spacing(5),
  },
  round: {
    position: 'absolute',
    top: 5,
    left: 10,
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
  const [role, setRole] = useState(undefined)

  useEffect(() => {
    if (!globalContext.roomCode || !globalContext.socket) {
      history.push('/')
      return () => {}
    }
    globalContext.socket.on('roomRoles', (data) => {
      console.log('ROOM ROLES: ', data)
      setBlueTeam(data.blueTeam)
      setWhiteTeam(data.whiteTeam)
      setJudges(Object.values(data.judges))
      const currentRole = data.blueTeam.find((member) => member.id === globalContext.socket.id)
        ? 'blueTeam'
        : data.whiteTeam.find((member) => member.id === globalContext.socket.id)
        ? 'whiteTeam'
        : 'judge'
      setRole(currentRole)
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
    globalContext.socket.on('gameOver', () => {
      console.log('GAME OVER')
      history.push('/')
    })

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
    }
  }, [])

  return (
    <div className={classes.root}>
      <div className={classes.whiteBg} />
      <Rules />
      <div className={classes.round}>
        <Typography variant="h4">Round TBD</Typography>
        <Typography variant="h5">Turn TBD</Typography>
      </div>

      <div className={classes.banner}>
        <div className={classes.bannerElement}>
          {whiteTeam.length > 0 && (
            <div className={classes.avatars}>
              <Avatar
                src={whiteTeam[0].icon ? whiteTeam[0].icon : '/logo192.png'}
                alt={whiteTeam[0].username}
              />
              <Typography variant="subtitle1">{whiteTeam[0].username}</Typography>
            </div>
          )}
          <Typography className={classes.vs} variant="h1">
            v.s
          </Typography>
          {blueTeam.length > 0 && (
            <div className={classes.avatars}>
              <Avatar
                src={blueTeam[0].icon ? blueTeam[0].icon : '/logo192.png'}
                alt={blueTeam[0].username}
              />
              <Typography variant="subtitle1">{blueTeam[0].username}</Typography>
            </div>
          )}
        </div>
        <div className={classes.bannerElement}>
          <Typography variant="h3">{timer}</Typography>
          <Typography variant="h5" className={classes.secondsRemaining}>
            {' '}
            second(s) remaining
          </Typography>
        </div>
      </div>
      <div className={classes.content}>
        {whiteTeam.length > 1 && blueTeam.length > 1 ? (
          <div className={classes.queue}>
            <PlayerQueue whiteTeam={whiteTeam.slice(1)} blueTeam={blueTeam.slice(1)} />
          </div>
        ) : (
          <></>
        )}
        <div className={classes.board}>
          <Board role={role} whiteTeamWord={whiteTeamWord} blueTeamWord={blueTeamWord} />
        </div>
        <div className={classes.chatBox}>
          {globalContext.socket && judges.length > 0 && <Chatbox judges={judges} />}
        </div>
      </div>
    </div>
  )
}
