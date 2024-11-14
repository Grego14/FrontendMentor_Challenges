import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/app/App.jsx'

history.scrollRestoration = 'manual'
const myRoot = createRoot(document.getElementById('root'))

myRoot.render(
  <StrictMode>
    <App />
  </StrictMode>
)
