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

  // const setRole = async role => {}

  useEffect(() => {
    if (!globalContext.roomCode || !globalContext.socket) {
      history.push('/')
      return () => {}
    }
    globalContext.socket.on('roomRoles', (data) => {
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
    })
    globalContext.socket.on('newDrawers', (data) => {
      setBlueTeam(data.blueTeam)
      setWhiteTeam(data.whiteTeam)
    })
    globalContext.socket.on('roundTimer', (data) => {
      // console.log('roundTimer', data.timeRemaining)
      setTimer(data.timeRemaining)
      setIsScreenshotPage(false)
    })
    globalContext.socket.on('wordAssignment', (data) => {
      setBlueTeamWord(data.blueTeamWord)
      setWhiteTeamWord(data.whiteTeamWord)
    })
    globalContext.socket.on('gameOver', (data) => {
      console.log(' GAME OVER, players', data.players)
      setPlayers(Object.values(data.players))
      setIsScreenshotPage(false)
      setIsGameOverPage(true)
    })

    globalContext.socket.on('startNextRound', () => {
      setIsScreenshotPage(false)
    })

    globalContext.socket.on('screenshotPage', (data) => {
      setIsScreenshotPage(true)
      setPlayers(Object.values(data.players))
      setWinningTeam(data.winningTeam === undefined ? 'timeOut' : data.winningTeam)
      setWinningJudge(data.winningJudge === undefined ? 'timeOut' : data.winningJudge)
      globalContext.updateUsers(data.players)
      console.log('players', data.players)
      console.log('winningTeam', data.winningTeam)
      console.log('winningJudge', data.winningJudge)
    })

    globalContext.socket.on('currentRound', (data) => {
      setRound(data.round)
      setTurn(data.turn)
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
