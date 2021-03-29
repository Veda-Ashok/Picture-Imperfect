import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import ScreenshotPage from '../src/components/game/ScreenshotPage'
import sampleScreenshot from './image'
import Context from '../src/context/context'

/**
 * A custom render to setup providers. Extends regular
 * render options with `providerProps` to allow injecting
 * different scenarios to test with.
 */
const customRender = (ui, { providerProps, ...renderOptions }) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return render(<Context.Provider {...providerProps}>{ui}</Context.Provider>, renderOptions)
}

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

describe('ScreenshotPage', () => {
  it('Renders the screenshot page for whiteTeam', () => {
    const providerProps = {
      value: {
        socket: undefined,
        addSocket: jest.fn(),
        roomCode: undefined,
        addRoomCode: jest.fn(),
        users: {},
        customWords: true,
        screenshot: { sampleScreenshot },
        myInfo: { username: 'tester', icon: '/logo192.png' },
      },
    }
    customRender(
      <ScreenshotPage
        players={players}
        winningTeam="whiteTeam"
        winningJudge={winningJudge}
        whiteTeam={whiteTeam}
        blueTeam={blueTeam}
        whiteTeamWord={whiteTeamWord}
        blueTeamWord={blueTeamWord}
        screenshotTimer={screenshotTimer}
        round={5}
        turn={2}
      />,
      { providerProps },
    )
    expect(screen.getByText('pizza won!')).toBeInTheDocument()
    expect(screen.getByText(`Points go to rachel and the white team...`)).toBeInTheDocument()
  })

  it('Renders the screenshot page for blueTeam', () => {
    const providerProps = {
      value: {
        socket: undefined,
        addSocket: jest.fn(),
        roomCode: undefined,
        addRoomCode: jest.fn(),
        users: {},
        customWords: true,
        screenshot: { sampleScreenshot },
        myInfo: { username: 'tester', icon: '/logo192.png' },
      },
    }
    customRender(
      <ScreenshotPage
        players={players}
        winningTeam="blueTeam"
        winningJudge={winningJudge}
        whiteTeam={whiteTeam}
        blueTeam={blueTeam}
        whiteTeamWord={whiteTeamWord}
        blueTeamWord={blueTeamWord}
        screenshotTimer={screenshotTimer}
        round={5}
        turn={2}
      />,
      { providerProps },
    )
    expect(screen.getByText(`Points go to rachel and the blue team...`)).toBeInTheDocument()
    expect(screen.getByText('soda won!')).toBeInTheDocument()
    expect(screen.getByText('Player Ranking 👑')).toBeInTheDocument()
  })

  it('Renders the screenshot page for a timeout', () => {
    const providerProps = {
      value: {
        socket: undefined,
        addSocket: jest.fn(),
        roomCode: undefined,
        addRoomCode: jest.fn(),
        users: {},
        customWords: true,
        screenshot: { sampleScreenshot },
        myInfo: { username: 'tester', icon: '/logo192.png' },
      },
    }
    customRender(
      <ScreenshotPage
        players={players}
        winningTeam="timeOut"
        winningJudge={winningJudge}
        whiteTeam={whiteTeam}
        blueTeam={blueTeam}
        whiteTeamWord={whiteTeamWord}
        blueTeamWord={blueTeamWord}
        screenshotTimer={screenshotTimer}
        round={5}
        turn={2}
      />,
      { providerProps },
    )
    expect(screen.getByText('Sorry! Time ran out...')).toBeInTheDocument()
    expect(screen.getByText('No one won!')).toBeInTheDocument()
    expect(screen.getByText('Player Ranking 👑')).toBeInTheDocument()
  })

  it('Renders the screenshot page for players leaving early', () => {
    const providerProps = {
      value: {
        socket: undefined,
        addSocket: jest.fn(),
        roomCode: undefined,
        addRoomCode: jest.fn(),
        users: {},
        customWords: true,
        screenshot: { sampleScreenshot },
        myInfo: { username: 'tester', icon: '/logo192.png' },
      },
    }
    customRender(
      <ScreenshotPage
        players={players}
        winningTeam="playersLeft"
        winningJudge={winningJudge}
        whiteTeam={whiteTeam}
        blueTeam={blueTeam}
        whiteTeamWord={whiteTeamWord}
        blueTeamWord={blueTeamWord}
        screenshotTimer={screenshotTimer}
        round={5}
        turn={2}
      />,
      { providerProps },
    )
    expect(screen.getByText('Sorry! People left so we had to end early...')).toBeInTheDocument()
    expect(screen.getByText('No one won!')).toBeInTheDocument()
    expect(screen.getByText('Player Ranking 👑')).toBeInTheDocument()
  })

  it('Renders the ranking dialog', () => {
    const providerProps = {
      value: {
        socket: undefined,
        addSocket: jest.fn(),
        roomCode: undefined,
        addRoomCode: jest.fn(),
        users: {},
        customWords: true,
        screenshot: { sampleScreenshot },
        myInfo: { username: 'tester', icon: '/logo192.png' },
      },
    }
    customRender(
      <ScreenshotPage
        players={players}
        winningTeam="playersLeft"
        winningJudge={winningJudge}
        whiteTeam={whiteTeam}
        blueTeam={blueTeam}
        whiteTeamWord={whiteTeamWord}
        blueTeamWord={blueTeamWord}
        screenshotTimer={screenshotTimer}
        round={5}
        turn={2}
      />,
      { providerProps },
    )
    fireEvent(
      screen.getByText('Player Ranking 👑'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeTruthy()
    expect(screen.getByText('👑 # 1')).toBeInTheDocument()
    expect(screen.getByText('# 2')).toBeInTheDocument()
    expect(screen.getByText('# 3')).toBeInTheDocument()
    expect(screen.getByText('# 4')).toBeInTheDocument()
    expect(screen.getByText('# 5')).toBeInTheDocument()
    expect(screen.getByText('# 6')).toBeInTheDocument()
    expect(screen.getByText('# --')).toBeInTheDocument()
  })
})
