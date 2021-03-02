/* eslint-disable no-nested-ternary */
import React, { useRef, useEffect, useContext } from 'react'
import { PropTypes } from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

// import io from 'socket.io-client'
import Context from '../../context/context'

const useStyles = makeStyles(() => ({
  banner: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
}))

export default function Board({ role, whiteTeamWord, blueTeamWord }) {
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

      mousex0 -= bounds.left
      mousex1 -= bounds.left
      mousey0 -= bounds.top
      mousey1 -= bounds.top

      mousex0 /= bounds.width
      mousex1 /= bounds.width
      mousey0 /= bounds.height
      mousey1 /= bounds.height

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

      if (!emit) {
        return
      }
      const w = canvas.width
      const h = canvas.height

      socketRef.current.emit('drawing', {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
      })
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
      memCtx.drawImage(canvas, 0, 0)
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height)
      canvas.style.width = '100%' // Note you must post fix the unit type %,px,em
      canvas.style.height = '100%'
    }

    window.addEventListener('resize', onResize, false)
    onResize()

    // ----------------------- socket.io connection ----------------------------
    const onDrawingEvent = (data) => {
      const w = canvas.width
      const h = canvas.height
      drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color)
    }

    socketRef.current = globalContext.socket
    socketRef.current.on('drawing', onDrawingEvent)
  }, [])

  // ------------- The Canvas --------------------------

  return (
    <div>
      <Typography variant="h5" className={classes.banner}>
        {role === 'whiteTeam'
          ? `You're on the white team, your word is ${whiteTeamWord}`
          : role === 'blueTeam'
          ? `You're on the blue team, your word is ${blueTeamWord}`
          : 'You are a judge'}
      </Typography>
      <canvas ref={canvasRef} aria-label="canvas" />
    </div>
  )
}

Board.propTypes = {
  whiteTeamWord: PropTypes.string.isRequired,
  blueTeamWord: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
}
