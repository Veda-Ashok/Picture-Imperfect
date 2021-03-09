import React from 'react'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'
import { PropTypes } from 'prop-types'

const useStyles = makeStyles((theme) => ({
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

export default function Player({ player, color }) {
  const classes = useStyles()

  return (
    <div className={color === 'white' ? classes.whiteElement : classes.blueElement}>
      <Avatar src={player.icon ? player.icon : '/logo192.png'} alt={player.username} />
      <div className={classes.elementText}>
        <Typography variant="subtitle1">{player.username}</Typography>
        <Typography variant="subtitle2">{`points: ${player.points}`}</Typography>
      </div>
    </div>
  )
}

Player.propTypes = {
  player: PropTypes.shape({
    username: PropTypes.string,
    icon: PropTypes.string,
    ready: PropTypes.bool,
    room: PropTypes.string,
    points: PropTypes.number,
  }).isRequired,
  color: PropTypes.string.isRequired,
}
