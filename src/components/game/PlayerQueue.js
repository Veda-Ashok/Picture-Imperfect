import React from 'react'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import { PropTypes } from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Player from './Player'

const useStyles = makeStyles((theme) => ({
  pair: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
  outerPaper: {
    border: '3px solid black',
    margin: theme.spacing(1),
    maxHeight: '60vh',
    overflow: 'auto',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    textAlign: 'center',
    padding: theme.spacing(1),
  },
}))

export default function PlayerQueue({ whiteTeam, blueTeam }) {
  const classes = useStyles()

  return (
    <Paper className={classes.outerPaper}>
      <Typography className={classes.center} variant="h5">
        Whos Up Next?!
      </Typography>
      <Divider />
      {whiteTeam.length >= blueTeam.length ? (
        <>
          {whiteTeam.map((player, index) => (
            <div key={player.username + blueTeam[index].username} className={classes.pair}>
              <Player color="white" player={player} />
              <Divider />
              {blueTeam.length < 1 ? <></> : <Player color="blue" player={blueTeam[index]} />}
              <Divider />
            </div>
          ))}
        </>
      ) : (
        <>
          {blueTeam.map((player, index) => (
            <div key={player.username + whiteTeam[index].username} className={classes.pair}>
              <Player color="blue" player={player} />
              <Divider />
              {whiteTeam.length < 1 ? <></> : <Player color="white" player={whiteTeam[index]} />}
              <Divider />
            </div>
          ))}
        </>
      )}
    </Paper>
  )
}

PlayerQueue.propTypes = {
  whiteTeam: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string,
      icon: PropTypes.string,
      ready: PropTypes.bool,
      room: PropTypes.string,
      points: PropTypes.number,
    }),
  ).isRequired,
  blueTeam: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string,
      icon: PropTypes.string,
      ready: PropTypes.bool,
      room: PropTypes.string,
      points: PropTypes.number,
    }),
  ).isRequired,
}
