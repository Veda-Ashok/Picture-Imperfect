import { render } from '@testing-library/react'
import React from 'react'
import io from 'socket.io-client'
import MockedSocket from 'socket.io-mock'
import Board from '../src/components/game/Board'

jest.mock('socket.io-client')

describe('Board', () => {
  let socket

  beforeEach(() => {
    socket = new MockedSocket()
    io.mockReturnValue(socket)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  HTMLCanvasElement.prototype.getContext = () => {
    return {}
  }

  it('Renders the board and connects to port 8080', () => {
    const { getByLabelText } = render(<Board />)
    const canvas = getByLabelText('canvas')
    expect(canvas).toBeTruthy()
    expect(io.connect).toHaveBeenCalledWith('ws://localhost:8080')
  })
})
