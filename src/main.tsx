import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Set --real-vh to the real viewport height for mobile browser compatibility
function setRealVh() {
  document.documentElement.style.setProperty('--real-vh', `${window.innerHeight}px`);
}
window.addEventListener('resize', setRealVh);
setRealVh();
