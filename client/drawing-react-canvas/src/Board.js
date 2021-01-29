import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

export default function Board() {

  const canvasRef = useRef(null)
  const socketRef = useRef()
  const contextRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [start, setStart] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth * 2
    canvas.height = window.innerHeight * 2
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`

    const context = canvas.getContext("2d")
    context.scale(2,2)
    context.lineCap = "round "
    context.strokeStyle = "black"
    context.lineWidth = 5
    contextRef.current = context

    socketRef.current = io.connect('/');
    socketRef.current.on('drawing', recieveDraw);
  }, [])

  const startDrawing = ({nativeEvent}) => {
    const {offsetX, offsetY} = nativeEvent
    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX, offsetY)
    setStart({ 'x0':offsetX, 'y0':offsetY })
    setIsDrawing(true)
  }

  const finishDrawing = () => {
    contextRef.current.closePath()
    setIsDrawing(false)
  }

  const draw = ({nativeEvent}) => {
    if(!isDrawing){
      return
    }
    const {offsetX, offsetY} = nativeEvent
    contextRef.current.lineTo(offsetX, offsetY)
    contextRef.current.stroke()
    socketRef.current.emit('drawing', {
        'x0': start['x0'],
        'y0': start['y0'],
        'x1': offsetX,
        'y1': offsetY,
    });
  }

  const recieveDraw = (data) => {
    const w = canvasRef.current.width;
    const h = canvasRef.current.height;
    contextRef.current.beginPath()
    contextRef.current.moveTo(data.x0 * w, data.y0 * h)
    contextRef.current.lineTo(data.x1 * w, data.y1 * h)
    contextRef.current.stroke()
    // drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
  }

  return (
    <canvas
    onMouseDown={startDrawing}
    onMouseUp={finishDrawing}
    onMouseMove={draw} 
    ref={canvasRef}
    />
  );
}