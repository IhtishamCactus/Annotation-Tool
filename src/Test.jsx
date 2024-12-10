import { useState, useRef } from 'react';
import { Stage, Layer, Arrow } from 'react-konva';
import Konva from 'konva';

export default function ColoredRect() {
  const [arrows, setArrows] = useState([])
  const [start, setStart] = useState([])
  const isDrawing = useRef(false)

  const handleMouseDown=(e)=>{

    isDrawing.current=true
    console.log("Pendown")
    const pos= e.target.getStage().getPointerPosition()
    setStart(pos)
    setArrows([...arrows, {points:[pos.x, pos.y, pos.x, pos.y]}])

  }

  const handleMouseMove=(e)=>{
    if(!isDrawing.current || !start) return

    const pos=e.target.getStage().getPointerPosition()
    const updatedArrows = arrows.slice()
    updatedArrows[updatedArrows.length-1].points=[start.x, start.y, pos.x, pos.y]
    setArrows(updatedArrows)
  }

  const handleMouseUp=()=>{
    isDrawing.current=false
    setStart(null)
  }


  return (
    <>
        
        <Stage
            width={window.innerWidth-20}
            height={500}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{border: "20px black"}}
        >
            <Layer>
                {arrows.map((arrow, index)=>(
                    <Arrow
                        key={index}
                        points={arrow.points}
                        stroke="red"
                        strokeWidth={5}
                        pointerLength={10}
                        pointerWidth={10}
                    />
                ))}
            </Layer>
        </Stage>

    </>
  );
};

