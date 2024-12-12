import { useState, useRef } from 'react';
import { Stage, Layer, Arrow } from 'react-konva';
import html2canvas from 'html2canvas';
//import Konva from 'konva';

export default function ColoredRect() {

  const [clicker, setClicker] = useState(false)
  const [arrows, setArrows] = useState([])
  const [start, setStart] = useState([])
  const [webURL, setWebURL] = useState('http://localhost:3000/auth/sign-in')

  const isDrawing = useRef(false)
  const stageRef = useRef(null)
  const iframeRef = useRef(null)


  const handleMouseDown=(e)=>{
    if (!clicker) return
    isDrawing.current=true
    console.log("Pendown")
    const pos= e.target.getStage().getPointerPosition()
    setStart(pos)
    setArrows([...arrows, {points:[pos.x, pos.y, pos.x, pos.y]}])

  }

  const handleMouseMove=(e)=>{
    if(!clicker || !isDrawing.current || !start) return

    const pos=e.target.getStage().getPointerPosition()
    const updatedArrows = arrows.slice()
    updatedArrows[updatedArrows.length-1].points=[start.x, start.y, pos.x, pos.y]
    setArrows(updatedArrows)
  }

  const handleMouseUp=()=>{
    if (!clicker) return
    isDrawing.current=false
    setStart(null)
  }

  const handleClearCanvas=()=>{
    setArrows([])
  }




  const takeScreenShot = async () => {
    if ( iframeRef.current) {
      try {
        const iframe = iframeRef.current;
        console.log(iframe)
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        console.log("iframe Content",iframeDoc)
        
        const iframeCanvas = await html2canvas(iframe.body);

        console.log("image data", iframeCanvas)
        const combinedCanvas = document.createElement('canvas');
        combinedCanvas.width = iframeCanvas.width;
        combinedCanvas.height = iframeCanvas.height;
        const ctx = combinedCanvas.getContext('2d');
        
        ctx.drawImage(iframeCanvas, 0, 0);
        
        const konvaImage = new Image();
        
        konvaImage.onload = () => {
          ctx.drawImage(konvaImage, 0, 0);
          const finalURL = combinedCanvas.toDataURL();
          console.log('Screenshot URL:', finalURL);
        };
        
        const konvaURL = stageRef.current.toDataURL();
        konvaImage.src = konvaURL;
      } catch (error) {
        console.log('error', error);
      }
    } else {
      console.log('Stage reference (stageRef.current) is null or undefined.');
    }
  }
  

  const handleURL=(e)=>{
    setWebURL(e.target.value)
  }


  return (
    <>
        <button
          onClick={()=>setClicker(!clicker)}
        >
          {clicker ? 'Stop Drawing': 'Start Drawing'}
        </button>
        <button onClick={handleClearCanvas}>Clear</button>
        <button onClick={takeScreenShot}>ScreenShot</button>
        <input
          type='text'
          value={webURL}
          onChange={handleURL}
          placeholder='Enter URL'
        />
        <div style={{position:'relative',width:window.innerWidth-40, height: 500, border: "5px solid black"}}>
          <iframe
          ref={iframeRef}
                src={webURL}
                style={{position:'absolute',width:'100%', height:'100%', top:0, left:0, zIndex:1}}
                sandbox="allow-scripts allow-forms allow-same-origin  allow-popups allow-pointer-lock allow-presentation"
              />
          <Stage
              width={window.innerWidth-40}
              height={500}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              ref={stageRef}
              style={{position:'absolute', top:0, left:0 ,zIndex:2, backgroundColor: 'transparent'}}
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
          </div>
    </>
  );
};

