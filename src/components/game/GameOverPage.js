/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useContext } from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'
import { PropTypes } from 'prop-types'
import { useHistory } from 'react-router-dom'
// import { amber } from '@material-ui/core/colors'
import Context from '../../context/context'
import Rules from '../reusable/Rules'

const useStyles = makeStyles((theme) => ({
  body: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    flexFlow: 'column',
  },
  rows: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
  },
  avatars: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
  },
  firstPlace: {
    width: '130px',
    height: '130px',
  },
  secondThirdPlace: {
    width: '90px',
    height: '90px',
  },
  winnerRoot: {
    display: 'grid',
  },
  winnersRank: {
    marginLeft: '2.2rem',
    paddingTop: '.3rem',
    gridColumn: 2,
    gridRow: 1,
    zIndex: 1,
    fontWeight: 800,
  },
  winnersCrown: {
    gridColumn: 2,
    gridRow: 1,
    width: '6rem',
  },
  screenshot: {
    width: '50%',
    backgroundColor: 'white',
    border: '3px solid black',
    margin: theme.spacing(2),
  },
  finalRanking: {
    padding: theme.spacing(3),
    fontWeight: 800,
    display: 'flex',
    justifyContent: 'center',
    background: 'white',
    marginBottom: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  margin: {
    marginBottom: theme.spacing(1),
  },
}))

export default function GameOverPage({ players }) {
  const history = useHistory()
  const classes = useStyles()
  const [firstPlacePlayers, setFirstPlacePlayers] = useState([])
  const [secondPlacePlayers, setSecondPlacePlayers] = useState([])
  const [thirdPlacePlayers, setThirdPlacePlayers] = useState([])
  const [etcPlayers, setEtcPlayers] = useState([])
  const globalContext = useContext(Context)

  useEffect(() => {
    setFirstPlacePlayers([])
    setSecondPlacePlayers([])
    setThirdPlacePlayers([])
    setEtcPlayers([])
    const sortedPlayers = players.sort((personA, personB) => personB.points - personA.points)
    let rank = 1
    let previousPlayer
    sortedPlayers.forEach((player, index) => {
      if (previousPlayer) {
        if (previousPlayer.points > player.points) {
          rank += 1
        }
      }
      previousPlayer = player
      sortedPlayers[index].rank = rank
      switch (rank) {
        case 1:
          setFirstPlacePlayers((oldFirstPlacePlayers) => [...oldFirstPlacePlayers, player])
          break
        case 2:
          setSecondPlacePlayers((oldSecondPlacePlayers) => [...oldSecondPlacePlayers, player])
          break
        case 3:
          setThirdPlacePlayers((oldThirdPlacePlayers) => [...oldThirdPlacePlayers, player])
          break
        default:
          setEtcPlayers((oldEtcPlayers) => [...oldEtcPlayers, player])
      }
    })
  }, [players])

  const handlePlayAgain = () => {
    globalContext.socket.emit('manualDisconnect')
    globalContext.updateUsers({}, globalContext)
    globalContext.updateMyInfo({}, globalContext)
    globalContext.updateScreenshot(undefined, globalContext)
    globalContext.addRoomCode(undefined, globalContext)
    globalContext.addSocket(undefined, globalContext)
    history.push('/')
    history.go(0)
  }

  const firstPlace = (player) => {
    return (
      <div className={classes.avatars}>
        <div className={classes.winnerRoot}>
          <Typography variant="h3" className={classes.winnersRank}>
            {player.rank}
          </Typography>
          <img alt="silverCrown" src="/media/FirstPlace.svg" className={classes.winnersCrown} />
        </div>
        <Avatar
          src={player.icon ? player.icon : '/logo192.png'}
          alt={player.username}
          className={classes.firstPlace}
        />
        <Typography variant="h5">{player.username}</Typography>
        <Typography variant="h6">{`points: ${player.points}`}</Typography>
      </div>
    )
  }

  const secondPlace = (player) => {
    return (
      <div className={classes.avatars}>
        <div className={classes.winnerRoot}>
          <Typography variant="h3" className={classes.winnersRank}>
            {player.rank}
          </Typography>
          <img alt="silverCrown" src="/media/SecondPlace.svg" className={classes.winnersCrown} />
        </div>
        <Avatar
          src={player.icon ? player.icon : '/logo192.png'}
          alt={player.username}
          className={classes.secondThirdPlace}
        />
        <Typography variant="h6">{player.username}</Typography>
        <Typography variant="subtitle2">{`points: ${player.points}`}</Typography>
      </div>
    )
  }

  const thirdPlace = (player) => {
    return (
      <div className={classes.avatars}>
        <div className={classes.winnerRoot}>
          <Typography variant="h3" className={classes.winnersRank}>
            {player.rank}
          </Typography>
          <img alt="silverCrown" src="/media/ThirdPlace.svg" className={classes.winnersCrown} />
        </div>
        <Avatar
          src={player.icon ? player.icon : '/logo192.png'}
          alt={player.username}
          className={classes.secondThirdPlace}
        />
        <Typography variant="h6">{player.username}</Typography>
        <Typography variant="subtitle2">{`points: ${player.points}`}</Typography>
      </div>
    )
  }

  const etc = (player) => {
    return (
      <div className={classes.avatars}>
        <Typography variant="h4" style={{ fontWeight: 800 }}>
          {player.rank}
        </Typography>
        <Avatar src={player.icon ? player.icon : '/logo192.png'} alt={player.username} />
        <Typography variant="subtitle1">{player.username}</Typography>
        <Typography variant="subtitle2">{`points: ${player.points}`}</Typography>
      </div>
    )
  }

  return (
    <div className={classes.body}>
      <Rules />
      <div className={classes.margin}>
        <div className={classes.finalRanking}>
          <Typography variant="h2"> Game Over!! </Typography>
        </div>
        <div className={classes.rows}>
          {firstPlacePlayers.length > 0 && firstPlacePlayers.map((player) => firstPlace(player))}
        </div>
        <div className={classes.rows}>
          {secondPlacePlayers.length > 0 && secondPlacePlayers.map((player) => secondPlace(player))}
          {thirdPlacePlayers.length > 0 && thirdPlacePlayers.map((player) => thirdPlace(player))}
        </div>
        <div className={classes.rows}>
          {etcPlayers && etcPlayers.length > 0 && etcPlayers.map((player) => etc(player))}
        </div>
        <div className={classes.rows}>
          <img
            className={classes.screenshot}
            src={globalContext.screenshot ? globalContext.screenshot : '/media/nobodyDrew.png'}
            alt="screenshot"
          />
        </div>
        <div className={classes.rows}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
            onClick={handlePlayAgain}
          >
            Play Again
          </Button>
        </div>
      </div>
    </div>
  )
}

GameOverPage.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string,
      icon: PropTypes.string,
      ready: PropTypes.bool,
      room: PropTypes.string,
      points: PropTypes.number,
    }),
  ).isRequired,
}
