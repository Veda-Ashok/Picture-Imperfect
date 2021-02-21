import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  send: {
    marginLeft: theme.spacing(1),
  },
  textfield: {
    marginTop: theme.spacing(0.1),
  },
}))

export default function ChatInput() {
  const classes = useStyles()
  const [chat, setChat] = useState('')

  const handleSubmitChat = (message) => {
    console.log(message)
    // socket emit chat event, emit message and username lol
  }

  return (
    <div className={classes.root}>
      <form
        action="."
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmitChat(chat)
          setChat('')
        }}
      >
        <TextField
          className={classes.textfield}
          size="small"
          variant="outlined"
          type="text"
          label="Enter message..."
          value={chat}
          onChange={(e) => setChat(e.target.value)}
        />
        <Button
          className={classes.send}
          size="medium"
          type="submit"
          variant="contained"
          color="primary"
        >
          Send
        </Button>
      </form>
    </div>
  )
}
