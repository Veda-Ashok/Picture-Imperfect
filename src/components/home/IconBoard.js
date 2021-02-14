import React, { useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  canvas: {
    height: '100px',
    width: '100px',
    border: '3px solid',
    borderColor: 'black',
  },
  text: {
    marginBottom: theme.spacing(1),
  },
}))

export default function IconBoard({ setIcon }) {
  const classes = useStyles()
  const canvasRef = useRef(null)

  useEffect(() => {
    // --------------- getContext() method returns a drawing canvesContext on the canvas-----

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    // ----------------------- Colors --------------------------------------------------

    const current = {
      color: 'black',
    }

    let drawing = false

    // ------------------------------- create the drawing ----------------------------

    const drawLine = (x0, y0, x1, y1) => {
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

      // console.log('coordinates:', mousex0, mousey0, mousex1, mousey1)
      context.beginPath()
      context.moveTo(mousex0, mousey0)
      context.lineTo(mousex1, mousey1)
      context.lineWidth = 30
      context.stroke()
      context.closePath()

      // const canvasPic = document.getElementById('canvas')
      const dataURL = canvas.toDataURL('image/png')
      setIcon(dataURL)
    }

    // const w = canvas.width
    // const h = canvas.height

    //   socketRef.current.emit('drawing', {
    //     x0: x0 / w,
    //     y0: y0 / h,
    //     x1: x1 / w,
    //     y1: y1 / h,
    // ---------------- mouse movement --------------------------------------

    const onMouseDown = (e) => {
      console.log('on mouse down')
      drawing = true
      current.x = e.clientX || e.touches[0].clientX
      current.y = e.clientY || e.touches[0].clientY
    }

    const onMouseMove = (e) => {
      console.log('on mouse move')
      if (!drawing) {
        return
      }
      drawLine(
        current.x,

        current.y,

        e.clientX || e.touches[0].clientX,

        e.clientY || e.touches[0].clientY,
      )
      current.x = e.clientX || e.touches[0].clientX
      current.y = e.clientY || e.touches[0].clientY
    }

    const onMouseUp = (e) => {
      console.log('on mouse up')
      if (!drawing) {
        return
      }
      drawing = false
      drawLine(
        current.x,

        current.y,

        e.clientX || e.changedTouches[0].clientX,

        e.clientY || e.changedTouches[0].clientY,
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
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      canvas.style.width = '100%' // Note you must post fix the unit type %,px,em
      canvas.style.height = '100%'
    }

    window.addEventListener('resize', onResize, false)
    onResize()

    // ----------------------- socket.io connection ----------------------------
    // const onDrawingEvent = (data) => {
    //   const w = canvas.width
    //   const h = canvas.height
    //   drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color)
    // }
  }, [])

  // ------------- The Canvas --------------------------

  return (
    <div className={classes.root}>
      <Typography className={classes.text}>Please draw your icon : )</Typography>
      <div className={classes.canvas}>
        <canvas ref={canvasRef} aria-label="canvas" />
      </div>
    </div>
  )
}

IconBoard.propTypes = {
  setIcon: PropTypes.func.isRequired,
}
