import { StrictMode } from 'react'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import StartGame from './pages/StartGame.jsx'
import PlayingArea from './pages/PlayingArea.jsx'
import { Toaster } from 'react-hot-toast'
import { Analytics } from "@vercel/analytics/react"

const router = createBrowserRouter([
  {
    path: '/game',
    element: <PlayingArea />
  }, {
    path: '/',
    element: <App />
  }, {
    path: '/start-game',
    element: <PlayingArea />
  }
])

createRoot(document.getElementById('root')).render(
  <>
    <Analytics />
    <Toaster />
    <RouterProvider router={router} />
  </>
)
