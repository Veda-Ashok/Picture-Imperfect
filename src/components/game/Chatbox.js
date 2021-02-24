import React, { useState, useEffect, useContext } from 'react'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'
import { PropTypes } from 'prop-types'
import Divider from '@material-ui/core/Divider'
import { amber } from '@material-ui/core/colors'
import Context from '../../context/context'
import ChatInput from './ChatInput'

const useStyles = makeStyles((theme) => ({
  chatLog: {
    padding: theme.spacing(1),
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column-reverse',
    borderBottom: '1px solid black',
    borderTop: '1px solid black',
    borderRadius: 0,
    maxHeight: theme.spacing(40),
  },
  outerPaper: {
    border: '3px solid black',
    margin: theme.spacing(1),
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    textAlign: 'center',
    padding: theme.spacing(1),
    textOverflow: 'ellipsis',
  },
  names: {
    fontWeight: 800,
    marginRight: theme.spacing(1),
  },
  texts: {
    display: 'flex',
    textOverflow: 'ellipsis',
  },
  avatars: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(1),
  },
}))

export default function Chatbox({ judges }) {
  const classes = useStyles()
  const [chatLog, setChatLog] = useState([
    { name: 'tester', text: 'this is what a chat would look like', id: 0 },
    { name: 'dfhgdh', text: 'im replying', id: 2 },
    {
      name: 'tester2',
      text: 'this messsage is long long long londsjkghjk ghjfdks lhgjkfdlsh sjkghs dshjfkh',
      id: 3,
    },
  ])
  const globalContext = useContext(Context)
  let messageCount = 0

  const handleChatUpdate = (data) => {
    setChatLog([...chatLog, { name: data.username, text: data.message, id: messageCount }])
    messageCount += 1
  }

  useEffect(() => {
    globalContext.socket.on('chat', handleChatUpdate)

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      globalContext.socket.off('chat', handleChatUpdate)
    }
  }, [])
  console.log(judges)

  return (
    <div>
      <Paper className={classes.outerPaper}>
        <div className={classes.center}>
          {judges &&
            judges.map((judge) => (
              <div className={classes.avatars} key={judge.username}>
                <Avatar src={judge.icon ? judge.icon : '/logo192.png'} alt={judge.username} />
                <Typography variant="subtitle1">{judge.username}</Typography>
              </div>
            ))}
        </div>
        <Divider />
        <Typography className={classes.center} variant="h4">
          What do you think it is?!
        </Typography>
        <Paper className={classes.chatLog}>
          <Typography variant="subtitle1">
            {chatLog.map((chat) => (
              <span key={chat.id} className={classes.texts}>
                <Typography
                  className={classes.names}
                  style={{
                    backgroundColor: judges.find((person) => chat.name === person.username)
                      ? amber[200]
                      : '#ffffff',
                  }}
                >
                  {chat.name}
                </Typography>
                <Typography>{chat.text}</Typography>
              </span>
            ))}
          </Typography>
        </Paper>
        <div className={classes.center}>
          <ChatInput judges={judges} />
        </div>
      </Paper>
    </div>
  )
}

Chatbox.propTypes = {
  judges: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string,
      icon: PropTypes.string,
      ready: PropTypes.bool,
      room: PropTypes.string,
    }),
  ).isRequired,
}
