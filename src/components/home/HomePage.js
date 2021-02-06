import React from 'react'
import { Button, TextField, Grid } from '@material-ui/core'

export default function HomePage() {
  return (
    <>
      <Grid container spacing={2}>
        <h1>Picture Imperfect</h1>
        <Grid item xs="12">
          <Button variant="contained" color="primary" href="/create">
            Create Game
          </Button>
        </Grid>
        <Grid item xs="12">
          <Button variant="contained" color="secondary" href="/join">
            Join Game
          </Button>
        </Grid>
        <Grid item xs="12">
          <TextField label="First Name" />
        </Grid>
      </Grid>
    </>
  )
}
