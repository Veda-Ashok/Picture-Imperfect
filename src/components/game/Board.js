/* eslint-disable no-nested-ternary */
import React, { useRef, useEffect, useContext, useState } from 'react'
import { PropTypes } from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import { amber } from '@material-ui/core/colors'

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
      fontSize: '.9em',
      width: '377px',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      fontSize: '1.2em',
      width: '500px',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '1.3em',
      width: '500px',
    },
    [theme.breakpoints.between('lg', 'xl')]: {
      fontSize: '1.5em',
      width: '712px',
    },
    [theme.breakpoints.up('xl')]: {
      fontSize: '1.9em',
      width: '1188px',
    },
  },
  canvas: {
    border: 'solid 2px black',
    [theme.breakpoints.down('sm')]: {
      width: '377px',
      height: '226px',
      flex: '0 0 377px',
      borderTop: '1px solid black',
      borderBottom: '1px solid black',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: '500px',
      height: '300px',
      flex: '0 0 500px',
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

function Board({ role, whiteTeamWord, blueTeamWord, yourTurn }) {
  const classes = useStyles()
  const globalContext = useContext(Context)
  const canvasRef = useRef(null)
  const socketRef = useRef()
  const [scale, setScale] = useState({ x: 1, y: 1 })

  const resized = () => {
    const { width, height } = canvasRef.current.getBoundingClientRect()

    if (canvasRef.current.width !== width || canvasRef.current.height !== height) {
      const { devicePixelRatio: ratio = 1 } = window
      canvasRef.current.width = canvasRef.current.clientWidth * ratio
      canvasRef.current.height = canvasRef.current.clientHeight * ratio
      setScale({ x: ratio, y: ratio })
    }
  }

  useEffect(() => {
    // --------------- getContext() method returns a drawing canvesContext on the canvas-----

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    // --------------------- Memory canvas for resizing ------------------------------------

    // const memCanvas = document.createElement('canvas')
    // const memCtx = memCanvas.getContext('2d')

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
      console.log(role)
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

    // -------------- call resized function -----------------
    resized()

    // const onResize = () => {
    //   memCanvas.width = canvas.width
    //   memCanvas.height = canvas.height
    //   memCanvas.style.width = '100%' // Note you must post fix the unit type %,px,em
    //   memCanvas.style.height = '100%'
    //   memCtx.drawImage(canvas, 0, 0)
    //   const bounds = canvas.getBoundingClientRect()
    //   canvas.width = bounds.width
    //   canvas.height = bounds.height
    //   canvas.style.width = '100%' // Note you must post fix the unit type %,px,em
    //   canvas.style.height = '100%'
    //   context.drawImage(memCanvas, 0, 0)
    // }

    // window.addEventListener('resize', onResize, false)
    // onResize()

    // ----------------------- socket.io connection ----------------------------

    const onDrawingEvent = (data) => {
      drawLine(data.x0, data.y0, data.x1, data.y1, false)
    }

    socketRef.current = globalContext.socket
    socketRef.current.on('drawing', onDrawingEvent)
  }, [])

  useEffect(() => {
    const currentCanvas = canvasRef.current
    currentCanvas.addEventListener('resize', resized)
    return () => currentCanvas.removeEventListener('resize', resized)
  })

  function draw(canvas, scaleX, scaleY) {
    const context = canvas.getContext('2d')
    context.scale(scaleX, scaleY)
    context.drawImage(canvas, 0, 0, canvas.clientWidth, canvas.clientHeight)
  }

  useEffect(() => {
    draw(canvasRef.current, scale.x, scale.y)
  }, [scale])

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
      <div>
        <canvas
          ref={canvasRef}
          aria-label="canvas"
          className={classes.canvas}
          style={{ backgroundColor: yourTurn ? amber[200] : 'white' }}
        />
      </div>
    </div>
  )
}

Board.propTypes = {
  whiteTeamWord: PropTypes.string.isRequired,
  blueTeamWord: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  yourTurn: PropTypes.bool.isRequired,
}

export default withWidth()(Board)
