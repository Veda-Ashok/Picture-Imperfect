import React, { useContext, useEffect } from 'react'
import { amber } from '@material-ui/core/colors'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Context from '../../context/context'
import PlayerAvatar from './PlayerAvatar'

const useStyles = makeStyles((theme) => ({
  avatars: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(1),
  },
  format: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
    height: '10%',
    overflow: 'auto',
  },
  flexItem: {
    margin: 'auto',
  },
}))

export default function ScreenshotUsers() {
  const classes = useStyles()
  const globalContext = useContext(Context)
  const { socket } = globalContext

  const handleUserUpdate = (data) => {
    const { users } = data
    console.log('inside screenshot users im running')
    globalContext.updateUsers(users, globalContext)
  }

  useEffect(() => {
    socket.on('roomUsers', handleUserUpdate)

    return () => {
      socket.off('roomUsers', handleUserUpdate)
    }
  }, [socket, handleUserUpdate])

  return (
    <div className={classes.format}>
      {Object.values(globalContext.users).map((user) => {
        return (
          <div className={classes.flexItem} key={user.username}>
            <div className={classes.avatars}>
              <PlayerAvatar username={user.username} icon={user.icon} />
              <Typography variant="subtitle1">{user.username}</Typography>
              {user.ready ? (
                <Typography variant="subtitle1" style={{ backgroundColor: amber[200] }}>
                  Let&apos;s go!
                </Typography>
              ) : (
                <Typography variant="subtitle1">Hold up!</Typography>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
