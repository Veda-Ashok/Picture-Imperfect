import React, { useContext, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'
import { amber } from '@material-ui/core/colors'
import Context from '../../context/context'

const useStyles = makeStyles((theme) => ({
  avatars: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(5),
  },
  format: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    // flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    overflow: 'auto',
  },
  flexItem: {
    margin: 'auto',
  },
}))

export default function LobbyUsers() {
  const classes = useStyles()
  const globalContext = useContext(Context)
  const { socket } = globalContext

  const handleUserUpdate = (data) => {
    const { users } = data
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
              <Avatar src={user.icon ? user.icon : '/logo192.png'} alt={user.username} />
              <Typography variant="subtitle1">{user.username}</Typography>
              {user.ready ? (
                <Typography variant="subtitle1" style={{ backgroundColor: amber[200] }}>
                  LET ME INNNNNNNNNN
                </Typography>
              ) : (
                <Typography variant="subtitle1">HOLD THE F*CKING PHONE!!</Typography>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
