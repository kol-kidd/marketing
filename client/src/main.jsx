import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'rsuite/dist/rsuite.min.css';
import "react-toastify/dist/ReactToastify.css";
import { DataProvider } from './Context/DataContext.jsx';  // Import your DataProvider
import { BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DataProvider> {/* Wrap your app in the provider */}
        <App />
      </DataProvider>
    </BrowserRouter>
  </StrictMode>,
)
