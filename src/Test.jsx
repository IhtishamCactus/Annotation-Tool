import React, { useState, useRef } from 'react';
import { Stage, Layer, Arrow, Text, Rect } from 'react-konva';
import html2canvas from 'html2canvas';
//import Konva from 'konva';

export default function ColoredRect() {

  const [clicker, setClicker] = useState(false)
  const [arrows, setArrows] = useState([])
  const [start, setStart] = useState([])
  const [webURL, setWebURL] = useState('http://localhost:3000/auth/sign-in')
  const [menuPosition, setMenuPosition] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([])

  const isDrawing = useRef(false)
  const stageRef = useRef(null)
  const iframeRef = useRef(null)

  const handleMouseDown=(e)=>{
    if (!clicker) return
    isDrawing.current=true
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

  const handleMouseUp=(e)=>{
    if (!clicker) return
    isDrawing.current=false
    setStart(null)


    const stage = e.target.getStage()
    const position = stage.getPointerPosition()
    setMenuPosition({
      x: position.x,
      y: position.y
    }) 
  }

  const handleClearCanvas=()=>{
    setArrows([])
    setComments([])
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

  const handleComment=(e)=>{
    setNewComment(e.target.value)
  }

  const handlePostComment=()=>{
    if(newComment && menuPosition){
      setComments([...comments, {text: newComment, x:menuPosition.x, y:menuPosition.y}])
      setNewComment('')
      setMenuPosition(null)
    }
  }

  const handleStageClick=(e)=>{
    const stage = e.target.getStage()
    const position = stage.getPointerPosition()
    setMenuPosition({
      x: position.x,
      y: position.y
    })

  }

  const closeMenu = () => {
    setMenuPosition(null)
  }

  const handleToggleDraw = ()=> {
    setClicker(!clicker)
    closeMenu()
  }

  const handleMenuClearCanvas = () =>{
    handleClearCanvas()
    closeMenu()
  }

  const handleMenuScreenShot = () =>{
    takeScreenShot()
    closeMenu()
  }

  const textWidth=(text)=>{
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '16px Arial';
    return context.measureText(text).width;
  }


  return (
    <>
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
              onClick={handleStageClick}
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
                  {comments.map((comment, index) => {
                  const padding = 15;
                  const textHeight = 13;

                  return (
                    <React.Fragment key={index}>
                      <Rect
                        x={comment.x - (textWidth(comment.text) + padding * 2) / 2}
                        y={comment.y - (textHeight + padding * 2) / 2}
                        width={textWidth(comment.text) + padding * 2}
                        height={textHeight + padding * 2}
                        fill="white"
                        stroke="black"
                        strokeWidth={3}
                        cornerRadius={8}
                      />
                      <Text
                        x={comment.x - textWidth(comment.text) / 2}
                        y={comment.y - textHeight / 2}
                        text={comment.text}
                        fontSize={16}
                        fill="black"
                        align="center"
                        verticalAlign="middle"
                      />
                    </React.Fragment>
                  );
                })}

              </Layer>
          </Stage>
          {menuPosition && (
            <div
            style={{
              position: 'absolute',
              top: menuPosition.y,
              left: menuPosition.x,
              background: 'white',
              boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
              zIndex: 3,
              borderRadius: '5px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '5px'
              }}
            >
              <input
                type="text"
                value={newComment}
                placeholder="Add a comment..."
                onChange={handleComment}
                style={{ flex: 1 }}
              />
              <button onClick={handlePostComment}>Post</button>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '5px'
              }}
            >
              <button onClick={handleToggleDraw}>
                {clicker ? 'Stop Drawing' : 'Start Drawing'}
              </button>
              <button onClick={handleMenuClearCanvas}>Clear</button>
              <button onClick={handleMenuScreenShot}>Screenshot</button>
            </div>
          </div>
          
          )}

          </div>
    </>
  );
};

