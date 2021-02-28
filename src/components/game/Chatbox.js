import React, { useEffect, useState, useContext } from 'react'
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
  const [chatLog, setChatLog] = useState([])
  const globalContext = useContext(Context)
  let messageCount = 0

  function handleChatUpdate(data) {
    console.log('server chat: ', data)
    setChatLog((oldChatLog) => [
      ...oldChatLog,
      { name: data.name, text: data.text, id: messageCount },
    ])
    // messageCount += 1
  }

  useEffect(() => {
    console.log('using effect in chat')
    globalContext.socket.on('chat', (data) => {
      console.log('chatLog before adding to array', chatLog)
      handleChatUpdate(data)
      // setChatLog([...chatLog, { name: data.name, text: data.text, id: messageCount }])
      console.log('after:', chatLog)
      messageCount += 1
    })

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      // globalContext.socket.off('chat', handleChatUpdate)
    }
  }, [])

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
            {console.log('chatLog', chatLog)}
            {chatLog.map((chat) => (
              <span key={chat.id} className={classes.texts}>
                {console.log('chatid: ', chat.id, chat)}
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
