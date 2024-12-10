import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ColoredRect from'./Test'
import './index.css'

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <ColoredRect/>
  </StrictMode>,
)

