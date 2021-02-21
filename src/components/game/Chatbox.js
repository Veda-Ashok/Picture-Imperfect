import React, { useState, useEffect, useContext } from 'react'
import { Typography } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
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
  },
  outerPaper: {
    border: '3px solid black',
    margin: theme.spacing(1),
  },
  chatInput: { display: 'flex', justifyContent: 'center', width: '100%' },
  names: {
    fontWeight: 800,
    marginRight: theme.spacing(1),
  },
  texts: {
    display: 'flex',
  },
}))

export default function Chatbox() {
  const classes = useStyles()
  const [chatLog, setChatLog] = useState([
    { name: 'tester', text: 'this is what a chat would look like', id: 0 },
    { name: 'tester2', text: 'im replying', id: 2 },
    {
      name: 'tester2',
      text: 'this messsage is long long long londsjkghjk ghjfdks lhgjkfdlsh sjkghs dshjfkh',
      id: 2,
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

  return (
    <div>
      <Paper className={classes.outerPaper}>
        <Typography variant="h4">What do you think it is?!</Typography>
        <Paper className={classes.chatLog}>
          <Typography variant="subtitle1">
            {chatLog.map((chat) => (
              <span key={chat.id} className={classes.texts}>
                <Typography className={classes.names}>{chat.name}</Typography>
                <Typography>{chat.text}</Typography>
              </span>
            ))}
          </Typography>
        </Paper>
        <div className={classes.chatInput}>
          <ChatInput />
        </div>
      </Paper>
    </div>
  )
}