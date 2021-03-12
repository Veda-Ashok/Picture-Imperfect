/* eslint-disable react/no-array-index-key */
import React, { useContext } from 'react'
import { PropTypes } from 'prop-types'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import { makeStyles } from '@material-ui/core/styles'
import { amber } from '@material-ui/core/colors'
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
    border: `solid 3px ${amber[200]}`,
    margin: theme.spacing(1),
  },
  othersRank: {
    border: `solid 3px black`,
    margin: theme.spacing(1),
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
  const playersGettingPoints =
    winningTeam === 'whiteTeam' ? [winningJudge, ...whiteTeam] : [winningJudge, ...blueTeam]

  return (
    <div className={classes.body}>
      <div className={classes.round}>
        <Typography variant="h5">Round TBD</Typography>
        <Typography variant="h6">Turn TBD</Typography>
      </div>
      <Rules />
      <Typography variant="h1">
        {`${winningTeam === 'whiteTeam' ? whiteTeamWord : blueTeamWord} was guessed!`}
      </Typography>
      <Typography variant="h5">
        {`Points go to ${winningJudge.username} and the 
        ${winningTeam === 'whiteTeam' ? 'white team' : 'blue team'}...`}
      </Typography>
      <div>
        {playersGettingPoints.map((player, index) => {
          return (
            <div key={`playersGettingPoints${index}`} className={classes.avatars}>
              <Avatar src={player.icon ? player.icon : '/logo192.png'} alt={player.username} />
              <Typography variant="subtitle1">{player.username}</Typography>
            </div>
          )
        })}
      </div>
      <img
        src="https://www.google.com/imgres?imgurl=https%3A%2F%2Fassets.newatlas.com%2Fdims4%2Fdefault%2F5ab0e1a%2F2147483647%2Fstrip%2Ftrue%2Fcrop%2F1999x1328%2B0%2B0%2Fresize%2F1440x957!%2Fquality%2F90%2F%3Furl%3Dhttp%253A%252F%252Fnewatlas-brightspot.s3.amazonaws.com%252Ffe%252F06%252F75f2c8704c71ade9c8881c997c8f%252Fdepositphotos-41105113-l-2015.jpg&imgrefurl=https%3A%2F%2Fnewatlas.com%2Fenvironment%2Fstudy-ocean-absorbs-double-co2%2F&tbnid=MMpB81B34lvCFM&vet=12ahUKEwj9rY_y2qnvAhXxIH0KHQxwC6oQMygBegUIARDTAQ..i&docid=iOjM0MV61FtUGM&w=1440&h=957&q=ocean&ved=2ahUKEwj9rY_y2qnvAhXxIH0KHQxwC6oQMygBegUIARDTAQ"
        alt="placeholder"
      />
      <div>
        <Typography variant="h4">{screenshotTimer}</Typography>
        <Typography variant="h6" className={classes.secondsRemaining}>
          {' '}
          second(s) remaining to save the image!
        </Typography>
      </div>
      <Button variant="contained" color="primary" size="large">
        Player Ranking 👑
      </Button>
      <Dialog>
        <DialogTitle>Current Player Ranking</DialogTitle>
        <DialogContent>
          {players
            .sort((playera, playerb) => {
              return playerb.points - playera.points
            })
            .map((player) => {
              return (
                <span
                  key={player.username}
                  className={
                    globalContext.yourInfo.username === player.username
                      ? classes.yourRank
                      : classes.othersRank
                  }
                >
                  <Player color="white" player={player} />
                </span>
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
  winningJudge: PropTypes.shape({
    username: PropTypes.string,
    icon: PropTypes.string,
    ready: PropTypes.bool,
    room: PropTypes.string,
    points: PropTypes.number,
  }).isRequired,
  winningTeam: PropTypes.string.isRequired,
  screenshotTimer: PropTypes.string.isRequired,
  blueTeamWord: PropTypes.string.isRequired,
  whiteTeamWord: PropTypes.string.isRequired,
}
