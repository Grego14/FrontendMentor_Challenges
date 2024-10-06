import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

if (history.scrollRestoration) {
  history.scrollRestoration = 'manual'
}
const myRoot = createRoot(document.getElementById('root'))

myRoot.render(
  <StrictMode>
    <App />
  </StrictMode>
)
