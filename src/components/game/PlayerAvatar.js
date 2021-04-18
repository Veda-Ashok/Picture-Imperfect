import React, { useContext } from 'react'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { PropTypes } from 'prop-types'
import Context from '../../context/context'

const StyledAvatar = withStyles(() => ({
  root: {
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '3px solid black',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(1)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Avatar)

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}))

export default function PlayerAvatar({ username, icon }) {
  const classes = useStyles()
  const globalContext = useContext(Context)

  return (
    <>
      {username === globalContext.myInfo.username ? (
        <div className={classes.root}>
          <StyledAvatar src={icon || '/logo192.png'} alt={username} />
        </div>
      ) : (
        <div className={classes.root}>
          <Avatar src={icon || '/logo192.png'} alt={username} />
        </div>
      )}
    </>
  )
}

PlayerAvatar.propTypes = {
  username: PropTypes.string.isRequired,
  icon: PropTypes.string,
}

PlayerAvatar.defaultProps = {
  icon: '/logo192.png',
}
