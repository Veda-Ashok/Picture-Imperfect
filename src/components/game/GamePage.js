/* eslint-disable no-nested-ternary */
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Context from '../../context/context'
import GamePlayPage from './GamePlayPage'
import ScreenshotPage from './ScreenshotPage'
import Loading from '../reusable/Loading'

const useStyles = makeStyles(() => ({
  loading: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
  },
}))

export default function GamePage() {
  const classes = useStyles()
  const history = useHistory()
  const globalContext = useContext(Context)
  const [blueTeam, setBlueTeam] = useState(undefined)
  const [whiteTeam, setWhiteTeam] = useState(undefined)
  const [judges, setJudges] = useState(undefined)
  const [timer, setTimer] = useState(undefined)
  const [blueTeamWord, setBlueTeamWord] = useState(undefined)
  const [whiteTeamWord, setWhiteTeamWord] = useState(undefined)
  const [role, setRole] = useState(undefined)
  const [screenshotTime, setScreenshotTime] = useState(undefined)
  const [players, setPlayers] = useState(undefined)
  const [winningTeam, setWinningTeam] = useState(undefined)
  const [winningJudge, setWinningJudge] = useState(undefined)
  const [screenshotTimer, setScreenshotTimer] = useState(undefined)

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
      setScreenshotTime(false)
    })
    globalContext.socket.on('newDrawers', (data) => {
      setBlueTeam(data.blueTeam)
      setWhiteTeam(data.whiteTeam)
    })
    globalContext.socket.on('roundTimer', (data) => {
      console.log('roundTimer', data.timeRemaining)
      setScreenshotTime(false)
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

    globalContext.socket.on('screenshotTimer', (data) => {
      setScreenshotTimer(data.currentTime)
      console.log('screenshotTimer', data.currentTime)
      if (parseInt(data.currentTime, 10) <= 1) {
        setScreenshotTime(false)
      }
    })

    globalContext.socket.on('screenshotPage', (data) => {
      setScreenshotTime(true)
      setPlayers(Object.values(data.players))
      setWinningTeam(data.winningTeam === undefined ? 'timeOut' : data.winningTeam)
      setWinningJudge(data.winningJudge === undefined ? 'timeOut' : data.winningTeam)
      console.log('players', data.players)
      console.log('winningTeam', data.winningTeam)
      console.log('winningJudge', data.winningJudge)
    })

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
    }
  }, [])

  const loadingPage = (
    <div className={classes.loading}>
      <Loading />
    </div>
  )

  return (
    <>
      {screenshotTime ? (
        <>
          {players &&
          winningJudge &&
          winningTeam &&
          blueTeam &&
          whiteTeam &&
          whiteTeamWord &&
          blueTeamWord ? (
            <ScreenshotPage
              players={players}
              winningTeam={winningTeam}
              winningJudge={winningJudge}
              whiteTeam={whiteTeam}
              blueTeam={blueTeam}
              whiteTeamWord={whiteTeamWord}
              blueTeamWord={blueTeamWord}
              screenshotTimer={screenshotTimer}
            />
          ) : (
            loadingPage
          )}
        </>
      ) : (
        <>
          {judges && blueTeam && whiteTeam && whiteTeamWord && blueTeamWord && role && timer ? (
            <GamePlayPage
              judges={judges}
              blueTeam={blueTeam}
              whiteTeam={whiteTeam}
              whiteTeamWord={whiteTeamWord}
              blueTeamWord={blueTeamWord}
              role={role}
              timer={timer}
            />
          ) : (
            loadingPage
          )}
        </>
      )}
    </>
  )
}
