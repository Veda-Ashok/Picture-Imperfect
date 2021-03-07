import React from 'react'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'
import { PropTypes } from 'prop-types'
import Divider from '@material-ui/core/Divider'

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
  blueElement: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1),
    backgroundColor: '#B2DAFF',
  },
  whiteElement: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  elementText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing(2),
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
      {whiteTeam.map((player, index) => (
        <div key={player.username + blueTeam[index].username} className={classes.pair}>
          <div className={classes.whiteElement}>
            <Avatar src={player.icon ? player.icon : '/logo192.png'} alt={player.username} />
            <div className={classes.elementText}>
              <Typography variant="subtitle1">{player.username}</Typography>
              <Typography variant="subtitle2">{`points: ${player.points}`}</Typography>
            </div>
          </div>
          <Divider />
          <div className={classes.blueElement}>
            <Avatar
              src={blueTeam[index].icon ? blueTeam[index].icon : '/logo192.png'}
              alt={blueTeam[index].username}
            />
            <div className={classes.elementText}>
              <Typography variant="subtitle1">{blueTeam[index].username}</Typography>
              <Typography variant="subtitle2">{`points: ${blueTeam[index].points}`}</Typography>
            </div>
          </div>
          <Divider />
        </div>
      ))}
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
