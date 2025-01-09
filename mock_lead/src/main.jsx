import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import {UserProvider} from './UserProvider.jsx'
import {GoogleOAuthProvider} from '@react-oauth/google'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <GoogleOAuthProvider clientId="206889780183-ga0dkrl4u01p6025in7ctottm2ksj7vt.apps.googleusercontent.com">
      <UserProvider>
      <App />
      </UserProvider>
    </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
