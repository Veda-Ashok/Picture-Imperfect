/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useState, useEffect } from 'react'
import { PropTypes } from 'prop-types'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import { makeStyles } from '@material-ui/core/styles'
import { amber } from '@material-ui/core/colors'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Context from '../../context/context'
import Rules from '../reusable/Rules'
import Player from './Player'

const useStyles = makeStyles((theme) => ({
  body: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
  },
  avatars: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  round: {
    position: 'absolute',
    top: 5,
    left: 10,
  },
  yourRank: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    border: `solid 3px ${amber[200]}`,
    margin: theme.spacing(1),
  },
  othersRank: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    border: `solid 3px black`,
    margin: theme.spacing(1),
  },
  winningWord: {
    paddingTop: theme.spacing(2),
  },
  playersGettingPoints: {
    display: 'flex',
  },
  screenshot: {
    width: '50%',
    backgroundColor: 'white',
    border: '3px solid black',
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  vs: {
    width: '50%',
    backgroundColor: 'white',
    borderTop: '3px solid black',
    borderRight: '3px solid black',
    borderLeft: '3px solid black',
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(1),
  },
  screenShotTimer: {
    display: 'flex',
    margin: theme.spacing(1),
  },
  secondsRemaining: {
    paddingTop: theme.spacing(0.7),
    paddingLeft: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: 'black',
  },
}))
export default function ScreenshotPage({
  players,
  winningTeam,
  winningJudge,
  whiteTeam,
  blueTeam,
  whiteTeamWord,
  blueTeamWord,
  screenshotTimer,
}) {
  const classes = useStyles()
  const globalContext = useContext(Context)
  const [openRanking, setOpenRanking] = useState(false)
  const handleCloseRanking = () => {
    setOpenRanking(false)
  }
  const handleOpenRanking = () => {
    setOpenRanking(true)
  }
  let playersGettingPoints
  let wordGuessed
  let turnResult
  if (winningTeam === 'whiteTeam') {
    playersGettingPoints = [winningJudge, ...whiteTeam]
    wordGuessed = whiteTeamWord
    turnResult = `Points go to ${winningJudge.username} and the white team...`
  } else if (winningTeam === 'blueTeam') {
    playersGettingPoints = [winningJudge, ...blueTeam]
    wordGuessed = blueTeamWord
    turnResult = `Points go to ${winningJudge.username} and the blue team...`
  } else if (winningTeam === 'timeOut') {
    wordGuessed = 'No one'
    playersGettingPoints = []
    turnResult = 'Sorry! Time ran out...'
  } else if (winningTeam === 'playersLeft') {
    wordGuessed = 'No one'
    playersGettingPoints = []
    turnResult = 'Sorry! People left so we had to end early...'
  }
  useEffect(() => {
    console.log(globalContext.screenshot)
  }, [])
  return (
    <div className={classes.body}>
      <div className={classes.round}>
        <Typography variant="h5">Round TBD</Typography>
        <Typography variant="h6">Turn TBD</Typography>
      </div>
      <Rules />
      <Typography className={classes.winningWord} variant="h2">{`${wordGuessed} won!`}</Typography>
      <Typography variant="h5">{turnResult}</Typography>

      <div className={classes.playersGettingPoints}>
        {playersGettingPoints.length > 1 &&
          playersGettingPoints.map((player, index) => {
            return (
              <div key={`playersGettingPoints${index}`} className={classes.avatars}>
                <Avatar src={player.icon ? player.icon : '/logo192.png'} alt={player.username} />
                <Typography variant="subtitle1">{player.username}</Typography>
              </div>
            )
          })}
      </div>
      <Typography className={classes.vs}>{`It was ${whiteTeamWord} vs ${blueTeamWord}`}</Typography>
      <img
        className={classes.screenshot}
        src={globalContext.screenshot ? globalContext.screenshot : '/media/nobodyDrew.png'}
        alt="screenshot"
      />
      <div className={classes.screenShotTimer}>
        <Typography variant="h4">{screenshotTimer}</Typography>
        <Typography variant="h6" className={classes.secondsRemaining}>
          {' '}
          second(s) remaining to save the image!
        </Typography>
      </div>
      <Button variant="contained" color="primary" size="large" onClick={handleOpenRanking}>
        Player Ranking 👑
      </Button>
      <Dialog
        className={classes.button}
        onClose={handleCloseRanking}
        fullWidth
        maxWidth="sm"
        aria-labelledby="player-ranking"
        open={openRanking}
      >
        <DialogTitle>
          Current Player Ranking
          {openRanking ? (
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleCloseRanking}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </DialogTitle>
        <DialogContent dividers>
          {players
            .sort((playera, playerb) => {
              return playerb.points - playera.points
            })
            .map((player, index, array) => {
              return (
                <div key={player.username}>
                  <span
                    className={
                      globalContext.myInfo.username === player.username
                        ? classes.yourRank
                        : classes.othersRank
                    }
                  >
                    <Typography variant="h4">
                      {`${index === 0 ? '👑' : ''} # ${
                        index > 0 && array[index - 1].points === array[index].points
                          ? '--'
                          : index + 1
                      }`}
                    </Typography>
                    <Player color="white" player={player} />
                  </span>
                </div>
              )
            })}
        </DialogContent>
      </Dialog>
    </div>
  )
}

ScreenshotPage.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string,
      icon: PropTypes.string,
      ready: PropTypes.bool,
      room: PropTypes.string,
      points: PropTypes.number,
    }),
  ).isRequired,
  whiteTeam: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string,
      icon: PropTypes.string,
      ready: PropTypes.bool,
      room: PropTypes.string,
      points: PropTypes.number,
    }),
  ).isRequired,
  blueTeam: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string,
      icon: PropTypes.string,
      ready: PropTypes.bool,
      room: PropTypes.string,
      points: PropTypes.number,
    }),
  ).isRequired,
  winningJudge: PropTypes.oneOfType([
    PropTypes.shape({
      username: PropTypes.string,
      icon: PropTypes.string,
      ready: PropTypes.bool,
      room: PropTypes.string,
      points: PropTypes.number,
    }),
    PropTypes.string,
  ]).isRequired,
  winningTeam: PropTypes.string.isRequired,
  screenshotTimer: PropTypes.number.isRequired,
  blueTeamWord: PropTypes.string.isRequired,
  whiteTeamWord: PropTypes.string.isRequired,
}
