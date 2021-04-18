/* eslint-disable no-nested-ternary */
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Context from '../../context/context'
import GamePlayPage from './GamePlayPage'
import GameOverPage from './GameOverPage'
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
  const [blueTeam, setBlueTeam] = useState()
  const [whiteTeam, setWhiteTeam] = useState()
  const [judges, setJudges] = useState()
  const [timer, setTimer] = useState()
  const [blueTeamWord, setBlueTeamWord] = useState('')
  const [whiteTeamWord, setWhiteTeamWord] = useState('')
  const [role, setRole] = useState('')
  const [players, setPlayers] = useState()
  const [winningTeam, setWinningTeam] = useState()
  const [winningJudge, setWinningJudge] = useState()
  const [isScreenshotPage, setIsScreenshotPage] = useState(false)
  const [isGameOverPage, setIsGameOverPage] = useState(false)
  const [round, setRound] = useState(0)
  const [turn, setTurn] = useState(0)

  // handle methods for sockets
  const handleScreenshotPage = (data) => {
    console.log('in handlesScreenShotPage', data)
    setIsScreenshotPage(true)
    setPlayers(Object.values(data.players))
    setWinningTeam(data.winningTeam)
    setWinningJudge(data.winningJudge ? data.winningJudge : 'No one')
    globalContext.updateUsers(data.players)
    console.log('value of players', Object.values(data.players))
    console.log('winningTeam', data.winningTeam)
    console.log('winningJudge', data.winningJudge)
  }

  const handleStartNextRound = () => {
    setIsScreenshotPage(false)
  }

  const handleGameOver = (data) => {
    console.log(' GAME OVER, players', data.players)
    setPlayers(Object.values(data.players))
    setIsScreenshotPage(false)
    setIsGameOverPage(true)
  }

  const handleWordAssignment = (data) => {
    setBlueTeamWord(data.blueTeamWord)
    setWhiteTeamWord(data.whiteTeamWord)
  }

  const handleRoundTimer = (data) => {
    setTimer(data.timeRemaining)
    setIsScreenshotPage(false)
  }

  const handleNewDrawers = (data) => {
    setBlueTeam(data.blueTeam)
    setWhiteTeam(data.whiteTeam)
  }

  const handleNewTurnRoles = (data) => {
    console.log('ROOM ROLES: ', data)
    globalContext.updateScreenshot('', globalContext)
    setBlueTeam(data.blueTeam)
    setWhiteTeam(data.whiteTeam)
    setJudges(Object.values(data.judges))
    const currentRole = data.blueTeam.find((member) => member.id === globalContext.socket.id)
      ? 'blueTeam'
      : data.whiteTeam.find((member) => member.id === globalContext.socket.id)
      ? 'whiteTeam'
      : 'judge'
    setRole(currentRole)
    setIsScreenshotPage(false)
  }

  const handleRoomRoles = (data) => {
    setBlueTeam(data.blueTeam)
    setWhiteTeam(data.whiteTeam)
    setJudges(Object.values(data.judges))
    const currentRole = data.blueTeam.find((member) => member.id === globalContext.socket.id)
      ? 'blueTeam'
      : data.whiteTeam.find((member) => member.id === globalContext.socket.id)
      ? 'whiteTeam'
      : 'judge'
    setRole(currentRole)
  }

  const handleCurrentRound = (data) => {
    setRound(data.round)
    setTurn(data.turn)
  }

  useEffect(() => {
    if (!globalContext.roomCode || !globalContext.socket) {
      history.push('/')
      return () => {}
    }
    globalContext.socket.on('newTurnRoles', handleNewTurnRoles)

    globalContext.socket.on('roomRoles', handleRoomRoles)

    globalContext.socket.on('newDrawers', handleNewDrawers)

    globalContext.socket.on('roundTimer', handleRoundTimer)

    globalContext.socket.on('wordAssignment', handleWordAssignment)

    globalContext.socket.on('gameOver', handleGameOver)

    globalContext.socket.on('startNextRound', handleStartNextRound)

    globalContext.socket.on('screenshotPage', handleScreenshotPage)

    globalContext.socket.on('currentRound', handleCurrentRound)

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      globalContext.socket.off('newTurnRoles', handleNewTurnRoles)

      globalContext.socket.off('roomRoles', handleRoomRoles)

      globalContext.socket.off('newDrawers', handleNewDrawers)

      globalContext.socket.off('roundTimer', handleRoundTimer)

      globalContext.socket.off('wordAssignment', handleWordAssignment)

      globalContext.socket.off('gameOver', handleGameOver)

      globalContext.socket.off('startNextRound', handleStartNextRound)

      globalContext.socket.off('screenshotPage', handleScreenshotPage)

      globalContext.socket.off('currentRound', handleCurrentRound)
    }
  }, [])

  const loadingPage = (
    <div className={classes.loading}>
      <Loading />
    </div>
  )

  return (
    <>
      {isScreenshotPage ? (
        <>
          {players &&
          winningJudge &&
          winningTeam &&
          blueTeam &&
          whiteTeam &&
          whiteTeamWord &&
          blueTeamWord &&
          round &&
          turn ? (
            <ScreenshotPage
              round={round}
              turn={turn}
              players={players}
              winningTeam={winningTeam}
              winningJudge={winningJudge}
              whiteTeam={whiteTeam}
              blueTeam={blueTeam}
              whiteTeamWord={whiteTeamWord}
              blueTeamWord={blueTeamWord}
            />
          ) : (
            loadingPage
          )}
        </>
      ) : (
        <>
          {isGameOverPage ? (
            <>{players ? <GameOverPage players={players} /> : loadingPage}</>
          ) : (
            <>
              {judges &&
              blueTeam &&
              whiteTeam &&
              whiteTeamWord &&
              blueTeamWord &&
              role &&
              timer &&
              round &&
              turn ? (
                <GamePlayPage
                  round={round}
                  judges={judges}
                  blueTeam={blueTeam}
                  whiteTeam={whiteTeam}
                  whiteTeamWord={whiteTeamWord}
                  blueTeamWord={blueTeamWord}
                  role={role}
                  turn={turn}
                  timer={timer}
                />
              ) : (
                loadingPage
              )}
            </>
          )}
        </>
      )}
    </>
  )
}
