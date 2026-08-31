import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { App } from './App'

// Restore a stored motion preference before React paints anything.
try {
  const stored = localStorage.getItem('mg.reduceMotion')
  if (stored !== null) document.documentElement.dataset.reduceMotion = stored === '1' ? 'true' : 'false'
} catch {
  /* storage unavailable — fall back to the OS preference */
}

const root = document.getElementById('root')
if (!root) throw new Error('#root is missing from index.html')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
