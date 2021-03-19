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
                  primary="1. At the beginning of each round, the players are split into two teams and one judge. In
          the case of a game having an even number of players, there will be two judges."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="2. For games with 5 people and less, each draw-er in a round is given a number. For games with
          more than 5 people, members of each team are given numbers both beginning at 1. "
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="3. Each team will receive a word that is different from the other team’s word. The judge(s) do not
          know the words."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="4. When the timer begins, both teams have 60 seconds to draw a picture of
          their word on a canvas that the other team shares. Members in the game draw when their
          number is called. "
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary=" 5. The judges have infinite guesses and can keep guessing within the
          time limit until they get it right. "
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary=" 6. If a judge guesses a team’s word, the members of the
          team that had the word and the judge who guessed the word all receive a point."
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="7. Each round the teams change as the judges are rotated in to be players" />
              </ListItem>
              <ListItem>
                <ListItemText primary="8. The first player to reach the number of points that is chosen at the beginning of the game first wins the game." />
              </ListItem>
            </List>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  )
}
