import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Splash from './Splash.jsx'
import { globalStyles } from './theme.js'

const styleTag = document.createElement('style')
styleTag.innerHTML = globalStyles
document.head.appendChild(styleTag)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Splash>
      <App />
    </Splash>
  </StrictMode>,
)