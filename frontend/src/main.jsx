import { StrictMode } from 'react'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import StartGame from './pages/StartGame.jsx'
import PlayingArea from './pages/PlayingArea.jsx'

const router = createBrowserRouter([
  {
    path: '/game',
    element: <PlayingArea />
  }, {
    path: '/',
    element: <App />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
