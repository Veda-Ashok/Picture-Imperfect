import React, { useState, useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Dialog from '@material-ui/core/Dialog'

const useStyles = makeStyles((theme) => ({
  rules: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: 'black',
  },
  helpButton: {
    color: 'black',
  },
  dialog: {
    margin: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
}))

export default function Rules() {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const descriptionElementRef = useRef(null)
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  return (
    <div>
      <IconButton aria-label="rules" className={classes.rules} onClick={handleClickOpen}>
        <HelpOutlineIcon className={classes.helpButton} fontSize="large" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          Rules
          {open ? (
            <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          ) : null}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <List aria-label="rule-list">
              <ListItem>
                <ListItemText
                  primary="1. The host creates a lobby where other players can join. 
                  The maximum number of players is 13 and the minimum is 3."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="2. The host can alter the number of rounds the game will have with the default being 3 rounds.
                   A round consists of multiple turns dependent on the number of players in the lobby."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="3. Players in the lobby can choose to input custom words, 
                  which have a possibility of being shown as actual words in the game."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="4. At the beginning of each turn, the players are split into two teams and one judge. In
          the case of a game having an even number of players, there will be two judges."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="5. Each team receives a word that is different from the other team's word. The judge(s) do not
          know the words."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="6. When the timer begins, both teams have 90 seconds to draw a picture of
          their word on a canvas that the other team shares. Members in a team take turns drawing with each member having 4 seconds."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="7. The two players that are currently drawing are listed at the top of the screen in the format of 'PlayerA VS. PlayerB'.
                   Additionally, an individual player's canvas will turn yellow when it is their turn to draw. 
                   If there are many players, a queue with who is up to draw next will be visible."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="8. The judges guess in the chat. Judges have infinite guesses and can keep guessing within the
          time limit until they get it right. There is a word hint at the top of the chatbox to gain insight into the length of each team's word."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="9. If a judge guesses a team’s word, that team and the judge who guessed the word all receive a point. 
                  When a turn ends the players are taken to a screenshot page. The next turn does not start until everyone hits the 'I'm Ready' button."
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="10. Each turn, the teams change as the judges are rotated in to be players. The next round only starts once every player has had the chance to be a judge." />
              </ListItem>
              <ListItem>
                <ListItemText primary="11. When the number of rounds specified by the host in the beginning of the game is reached, the game ends. The winner is the player with the most points by the end of all the rounds." />
              </ListItem>
            </List>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  )
}
