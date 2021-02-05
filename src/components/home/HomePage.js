import React from 'react'
import Button from '@material-ui/core/Button'

export default function HomePage() {
  return (
    <>
      <h1>Picture Imperfect</h1>
      <Button color="secondary" href="/create">
        Create Game
      </Button>
      <Button href="/join">Join Game</Button>
    </>
  )
}
