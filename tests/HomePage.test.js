import { render } from '@testing-library/react'
import React from 'react'
import HomePage from '../src/components/home/HomePage'

describe('App', () => {
  it('Renders the home page', () => {
    const { getByText } = render(<HomePage />)
    expect(getByText('Picture Imperfect')).toBeInTheDocument()
  })
})
