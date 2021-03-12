/* eslint-disable no-nested-ternary */
import React, { useContext } from 'react'
import { PropTypes } from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth'
import Context from '../../context/context'
import Chatbox from './Chatbox'
import Rules from '../reusable/Rules'
import Board from './Board'
import PlayerQueue from './PlayerQueue'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  whiteBg: {
    position: 'absolute',
    width: '50%',
    top: 0,
    left: 0,
    backgroundColor: 'white',
    height: '100vh',
    zIndex: -900,
    [theme.breakpoints.up('xl')]: {
      height: '140vh',
    },
    [theme.breakpoints.down('sm')]: {
      height: '100%',
    },
  },
  chatBox: {
    width: '30%',
    margin: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      margin: theme.spacing(1),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: '60%',
      margin: theme.spacing(1),
    },
  },
  queue: {
    width: '30%',
    margin: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      margin: theme.spacing(1),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: '50%',
      margin: theme.spacing(1),
    },
  },
  banner: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(7),
    },
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  pair: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  bannerElement: {
    display: 'flex',
    marginBottom: theme.spacing(1),
  },
  secondsRemaining: {
    paddingTop: theme.spacing(1.5),
    paddingLeft: theme.spacing(2),
  },
  board: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    alignItems: 'center',
  },
  avatars: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  vs: {
    paddingRight: theme.spacing(5),
    paddingLeft: theme.spacing(5),
  },
  round: {
    position: 'absolute',
    top: 5,
    left: 10,
  },
}))

function GamePlayPage({
  width,
  blueTeam,
  whiteTeam,
  judges,
  timer,
  blueTeamWord,
  whiteTeamWord,
  role,
}) {
  const classes = useStyles()
  const globalContext = useContext(Context)

  const chatbox = (
    <div className={classes.chatBox}>
      {globalContext.socket && judges.length > 0 && <Chatbox judges={judges} />}
    </div>
  )
  const playerQueue = (
    <>
      {whiteTeam.length > 1 && blueTeam.length > 1 ? (
        <div className={classes.queue}>
          <PlayerQueue whiteTeam={whiteTeam.slice(1)} blueTeam={blueTeam.slice(1)} />
        </div>
      ) : (
        <></>
      )}
    </>
  )

  return (
    <div className={classes.root}>
      <div className={classes.whiteBg} />
      <Rules />
      <div className={classes.round}>
        <Typography variant="h5">Round TBD</Typography>
        <Typography variant="h6">Turn TBD</Typography>
      </div>

      <div className={classes.banner}>
        <div className={classes.bannerElement}>
          {whiteTeam.length > 0 && (
            <div className={classes.avatars}>
              <Avatar
                src={whiteTeam[0].icon ? whiteTeam[0].icon : '/logo192.png'}
                alt={whiteTeam[0].username}
              />
              <Typography variant="subtitle1">{whiteTeam[0].username}</Typography>
            </div>
          )}
          <Typography className={classes.vs} variant="h1">
            v.s
          </Typography>
          {blueTeam.length > 0 && (
            <div className={classes.avatars}>
              <Avatar
                src={blueTeam[0].icon ? blueTeam[0].icon : '/logo192.png'}
                alt={blueTeam[0].username}
              />
              <Typography variant="subtitle1">{blueTeam[0].username}</Typography>
            </div>
          )}
        </div>
        <div className={classes.bannerElement}>
          <Typography variant="h4">{timer}</Typography>
          <Typography variant="h6" className={classes.secondsRemaining}>
            {' '}
            second(s) remaining
          </Typography>
        </div>
      </div>

      <div className={classes.content}>
        {isWidthUp('md', width) && chatbox}
        <div className={classes.board}>
          {blueTeam.length > 0 && whiteTeam.length > 0 && (
            <Board
              role={role}
              whiteTeamWord={whiteTeamWord}
              blueTeamWord={blueTeamWord}
              yourTurn={
                blueTeam[0].username === globalContext.myInfo.username ||
                whiteTeam[0].username === globalContext.myInfo.username
              }
            />
          )}
        </div>
        {isWidthDown('sm', width) ? (
          <div className={classes.pair}>
            {chatbox}
            {playerQueue}
          </div>
        ) : (
          playerQueue
        )}
      </div>
    </div>
  )
}

GamePlayPage.propTypes = {
  width: PropTypes.string.isRequired,
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
  judges: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string,
      icon: PropTypes.string,
      ready: PropTypes.bool,
      room: PropTypes.string,
      points: PropTypes.number,
    }),
  ).isRequired,
  role: PropTypes.string.isRequired,
  timer: PropTypes.string.isRequired,
  blueTeamWord: PropTypes.string.isRequired,
  whiteTeamWord: PropTypes.string.isRequired,
}

export default withWidth()(GamePlayPage)
