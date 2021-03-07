/* eslint-disable no-nested-ternary */
import React, { useRef, useEffect, useContext } from 'react'
import { PropTypes } from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'

// import io from 'socket.io-client'
import Context from '../../context/context'

const useStyles = makeStyles((theme) => ({
  banner: {
    backgroundColor: 'white',
    borderTop: 'solid 3px black',
    borderRight: 'solid 3px black',
    borderLeft: 'solid 3px black',
    borderBottom: 'solid 1px black',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    padding: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
      fontSize: '.8em',
      width: '377px',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      marginTop: theme.spacing(5),
      fontSize: '.8em',
      width: '377px',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      marginTop: theme.spacing(3),
      fontSize: '1.1em',
      width: '500px',
    },
    [theme.breakpoints.between('lg', 'xl')]: {
      marginTop: theme.spacing(0),
      fontSize: '1.4em',
      width: '712px',
    },
    [theme.breakpoints.up('xl')]: {
      fontSize: '1.7em',
      width: '1188px',
    },
  },
  canvas: {
    backgroundColor: 'white',
    border: 'solid 2px black',
    [theme.breakpoints.down('sm')]: {
      width: '377px',
      height: '226px',
      flex: '0 0 377px',
      borderTop: '1px solid black',
      borderBottom: '1px solid black',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: '377px',
      height: '226px',
      flex: '0 0 377px',
      borderTop: '1px solid black',
      borderBottom: '1px solid black',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      width: '500px',
      height: '300px',
      flex: '0 0 500px',
      borderTop: '1px solid black',
      borderBottom: '1px solid black',
    },
    [theme.breakpoints.between('lg', 'xl')]: {
      width: '712px',
      height: '428px',
      flex: '0 0 712px',
      borderTop: '1px solid black',
      borderBottom: '1px solid black',
    },
    [theme.breakpoints.up('xl')]: {
      width: '1188px',
      height: '714px',
      flex: '0 0 1188px',
      borderTop: '1px solid black',
      borderBottom: '1px solid black',
    },
  },
}))

function Board({ role, whiteTeamWord, blueTeamWord }) {
  const classes = useStyles()
  const globalContext = useContext(Context)
  const canvasRef = useRef(null)
  const socketRef = useRef()

  useEffect(() => {
    // --------------- getContext() method returns a drawing canvesContext on the canvas-----

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    // --------------------- Memory canvas for resizing ------------------------------------

    const memCanvas = document.createElement('canvas')
    const memCtx = memCanvas.getContext('2d')

    // ----------------------- Colors --------------------------------------------------

    // set the current color
    const current = {
      color: 'black',
    }

    let drawing = false

    // ------------------------------- create the drawing ----------------------------

    const drawLine = (x0, y0, x1, y1, emit) => {
      const bounds = canvas.getBoundingClientRect()
      let mousex0 = x0
      let mousex1 = x1
      let mousey0 = y0
      let mousey1 = y1

      // if emit is false then the data came from the server so this has already been done
      if (emit) {
        mousex0 -= bounds.left
        mousex1 -= bounds.left
        mousey0 -= bounds.top
        mousey1 -= bounds.top
        mousex0 /= bounds.width
        mousex1 /= bounds.width
        mousey0 /= bounds.height
        mousey1 /= bounds.height
        socketRef.current.emit('drawing', {
          x0: mousex0,
          y0: mousey0,
          x1: mousex1,
          y1: mousey1,
        })
      }
      mousex0 *= canvas.width
      mousex1 *= canvas.width
      mousey0 *= canvas.height
      mousey1 *= canvas.height

      context.beginPath()
      context.moveTo(mousex0, mousey0)
      context.lineTo(mousex1, mousey1)
      context.lineWidth = 3
      context.stroke()
      context.closePath()

      // if (!emit) {
      //   return
      // }
      // const w = canvas.width
      // const h = canvas.height
    }

    // ---------------- mouse movement --------------------------------------

    const onMouseDown = (e) => {
      drawing = true
      current.x = e.clientX || e.touches[0].clientX
      current.y = e.clientY || e.touches[0].clientY
    }

    const onMouseMove = (e) => {
      if (!drawing) {
        return
      }
      drawLine(
        current.x,

        current.y,

        e.clientX || e.touches[0].clientX,

        e.clientY || e.touches[0].clientY,

        true,
      )
      current.x = e.clientX || e.touches[0].clientX
      current.y = e.clientY || e.touches[0].clientY
    }

    const onMouseUp = (e) => {
      if (!drawing) {
        return
      }
      drawing = false
      drawLine(
        current.x,

        current.y,

        e.clientX || e.changedTouches[0].clientX,

        e.clientY || e.changedTouches[0].clientY,

        true,
      )
    }

    // ----------- limit the number of events per second -----------------------

    const throttle = (callback, delay) => {
      let previousCall = new Date().getTime()
      return function () {
        const time = new Date().getTime()
        if (time - previousCall >= delay) {
          previousCall = time
          // eslint-disable-next-line
          callback.apply(null, arguments)
        }
      }
    }

    // -----------------add event listeners to our canvas ----------------------

    canvas.addEventListener('mousedown', onMouseDown, false)
    canvas.addEventListener('mouseup', onMouseUp, false)
    canvas.addEventListener('mouseout', onMouseUp, false)
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false)

    // Touch support for mobile devices
    canvas.addEventListener('touchstart', onMouseDown, false)
    canvas.addEventListener('touchend', onMouseUp, false)
    canvas.addEventListener('touchcancel', onMouseUp, false)
    canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false)

    // -------------- make the canvas fill its parent component -----------------

    const onResize = () => {
      memCanvas.width = canvas.width
      memCanvas.height = canvas.height
      memCanvas.style.width = '100%' // Note you must post fix the unit type %,px,em
      memCanvas.style.height = '100%'
      memCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height)
      const bounds = canvas.getBoundingClientRect()
      canvas.width = bounds.width
      canvas.height = bounds.height
      canvas.style.width = '100%' // Note you must post fix the unit type %,px,em
      canvas.style.height = '100%'
      context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height)
    }

    window.addEventListener('resize', onResize, false)
    onResize()

    // ----------------------- socket.io connection ----------------------------
    const onDrawingEvent = (data) => {
      drawLine(data.x0, data.y0, data.x1, data.y1, false)
    }

    socketRef.current = globalContext.socket
    socketRef.current.on('drawing', onDrawingEvent)
  }, [])

  // ------------- The Canvas --------------------------

  return (
    <div>
      <Typography className={classes.banner}>
        {role === 'whiteTeam'
          ? `You're on the white team, your word is ${whiteTeamWord}`
          : role === 'blueTeam'
          ? `You're on the blue team, your word is ${blueTeamWord}`
          : 'You are a judge'}
      </Typography>
      <div className={classes.canvas}>
        <canvas ref={canvasRef} aria-label="canvas" className={classes.canvas} />
      </div>
    </div>
  )
}

Board.propTypes = {
  whiteTeamWord: PropTypes.string.isRequired,
  blueTeamWord: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
}

export default withWidth()(Board)
