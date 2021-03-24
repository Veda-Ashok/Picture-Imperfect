import React, { useContext, useEffect } from 'react'
import Context from '../../context/context'
import ResultsPage from '../game/ResultsPage'

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

export default function TestingResultPage() {
  const globalContext = useContext(Context)
  useEffect(() => {
    globalContext.updateMyInfo({ username: 'rachel', icon: '/logo192.png' }, globalContext)
  }, [])

  return <>{globalContext.myInfo.username && <ResultsPage players={players} />}</>
}
