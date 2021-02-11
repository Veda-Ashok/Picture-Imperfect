import { render, screen } from '@testing-library/react'
import React from 'react'
import HomePage from '../src/components/home/HomePage'
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

describe('Homepage', () => {
  it('Renders the home page', () => {
    const providerProps = {
      value: {
        socket: undefined,
        addSocket: jest.fn(),
        roomCode: undefined,
        addRoomCode: jest.fn(),
      },
    }
    customRender(<HomePage />, { providerProps })
    expect(screen.getByText('Picture')).toBeInTheDocument()
    expect(screen.getByText('Imperfect')).toBeInTheDocument()
    expect(screen.getByText('Create Game')).toBeInTheDocument()
    expect(screen.getByText('Join Game')).toBeInTheDocument()
  })
})
