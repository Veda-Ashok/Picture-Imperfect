import Typography from '@material-ui/core/Typography'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Avatar from '@material-ui/core/Avatar'

const useStyles = makeStyles({
  loading: {
    display: 'grid',
  },
  avatar: {
    marginTop: '10px',
    marginLeft: '10px',
    gridColumn: 2,
    gridRow: 1,
  },
  circle: {
    gridColumn: 2,
    gridRow: 1,
    zIndex: 1,
  },
  text: {
    gridColumn: 2,
    gridRow: 2,
  },
})

export default function Loading() {
  const classes = useStyles()
  return (
    <div className={classes.loading}>
      <Avatar src="/media/Logo.svg" alt="logo" className={classes.avatar} />
      <CircularProgress className={classes.circle} size={100} color="secondary" />
      <Typography className={classes.text} variant="h6">
        Loading...
      </Typography>
    </div>
  )
}
