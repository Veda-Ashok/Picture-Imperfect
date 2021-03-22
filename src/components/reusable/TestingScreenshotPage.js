import React, { useContext, useEffect } from 'react'
import Context from '../../context/context'
import ScreenshotPage from '../game/ScreenshotPage'
import sampleScreenshot from './image'

const whiteTeamWord = 'pizza'
const blueTeamWord = 'soda'
const screenshotTimer = 10
const winningJudge = {
  username: 'rachel',
  icon: '/logo192.png',
  points: 10,
  room: 'yyxcev',
  ready: false,
  id: 'socketid1234',
}
const players = [
  {
    icon: '',
    id: 'JGMxwjRlu4xNlW1GAAAH',
    points: 1,
    ready: true,
    room: 'yyxcev',
    username: 'michae',
  },
  {
    icon: '',
    id: 'XeuvxBcWGLI1-EOhAAAF',
    points: 1,
    ready: true,
    room: 'yyxcev',
    username: 'hehe',
  },
  {
    icon: '',
    id: 'ZmKfAhiMQDZNFPonAAAJ',
    points: 3,
    ready: true,
    room: 'yyxcev',
    username: 'heheheeheh',
  },
  {
    icon: '',
    id: 'k1vIRR3jv9P1Mbb8AAAD',
    points: 4,
    ready: true,
    room: 'yyxcev',
    username: 'df',
  },
  {
    icon: '',
    id: 'k1vIRR3jv4P1Mbb8AAAD',
    points: 5,
    ready: true,
    room: 'yyxcev',
    username: 'lover',
  },
  {
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABSQA',
    id: 's-SqWs3LRk6tuG_NAAAB',
    points: 6,
    ready: true,
    room: 'yyxcev',
    username: 'hi',
  },
  {
    username: 'rachel',
    icon: '/logo192.png',
    points: 7,
    room: 'yyxcev',
    ready: false,
    id: 'socketid1234',
  },
]
const whiteTeam = [
  {
    icon: '',
    id: 'JGMxwjRlu4xNlW1GAAAH',
    points: 1,
    ready: true,
    room: 'yyxcev',
    username: 'michae',
  },
  {
    icon: '',
    id: 'XeuvxBcWGLI1-EOhAAAF',
    points: 1,
    ready: true,
    room: 'yyxcev',
    username: 'hehe',
  },
  {
    icon: '',
    id: 'ZmKfAhiMQDZNFPonAAAJ',
    points: 3,
    ready: true,
    room: 'yyxcev',
    username: 'heheheeheh',
  },
]

const blueTeam = [
  {
    icon: '',
    id: 'k1vIRR3jv9P1Mbb8AAAD',
    points: 4,
    ready: true,
    room: 'yyxcev',
    username: 'df',
  },
  {
    icon: '',
    id: 'k1vIRR3jv4P1Mbb8AAAD',
    points: 5,
    ready: true,
    room: 'yyxcev',
    username: 'lover',
  },
  {
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABSQA',
    id: 's-SqWs3LRk6tuG_NAAAB',
    points: 6,
    ready: true,
    room: 'yyxcev',
    username: 'hi',
  },
]

export default function TestingScreenshotPage() {
  const globalContext = useContext(Context)
  useEffect(() => {
    globalContext.updateMyInfo({ username: 'rachel', icon: '/logo192.png' }, globalContext)
    globalContext.updateScreenshot(sampleScreenshot, globalContext)
  }, [])

  return (
    <>
      {globalContext.myInfo.username && (
        <ScreenshotPage
          players={players}
          winningTeam="blueTeam"
          winningJudge={winningJudge}
          whiteTeam={whiteTeam}
          blueTeam={blueTeam}
          whiteTeamWord={whiteTeamWord}
          blueTeamWord={blueTeamWord}
          screenshotTimer={screenshotTimer}
        />
      )}
    </>
  )
}
