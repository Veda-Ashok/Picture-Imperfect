/* eslint-disable no-nested-ternary */
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Context from '../../context/context'
import GamePlayPage from './GamePlayPage'

export default function GamePage() {
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

    globalContext.socket.on('screenshotTimer', (data) => {
      console.log('screenshotTimer', data.currentTime)
    })

    globalContext.socket.on('screenshotPage', (data) => {
      console.log('players', data.players)
      console.log('winningTeam', data.winningTeam)
      console.log('winningJudge', data.winningJudge)
    })

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
    }
  }, [])

  return (
    <GamePlayPage
      judges={judges}
      blueTeam={blueTeam}
      whiteTeam={whiteTeam}
      whiteTeamWord={whiteTeamWord}
      blueTeamWord={blueTeamWord}
      role={role}
      timer={timer}
    />
  )
}
