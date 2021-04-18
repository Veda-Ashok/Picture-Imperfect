import React, { useContext } from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { PropTypes } from 'prop-types'
import { amber } from '@material-ui/core/colors'
import Context from '../../context/context'
import PlayerAvatar from './PlayerAvatar'

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
    backgroundColor: '#FFFFFF',
  },
  me: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1),
    backgroundColor: amber[200],
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
  const globalContext = useContext(Context)

  return (
    <>
      {player.username === globalContext.myInfo.username ? (
        <div className={classes.me}>
          <PlayerAvatar username={player.username} icon={player.icon} />
          <div className={classes.elementText}>
            <Typography variant="h6">{player.username}</Typography>
            <Typography variant="subtitle2">{`points: ${player.points}`}</Typography>
          </div>
        </div>
      ) : (
        <div className={color === 'white' ? classes.whiteElement : classes.blueElement}>
          <PlayerAvatar username={player.username} icon={player.icon} />
          <div className={classes.elementText}>
            <Typography variant="subtitle1">{player.username}</Typography>
            <Typography variant="subtitle2">{`points: ${player.points}`}</Typography>
          </div>
        </div>
      )}
    </>
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
