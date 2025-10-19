import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from "./context/CartContext";
import Watermark from './components/WatermarkedImage.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <App />
      <Watermark />
    </CartProvider>
  </StrictMode>,
)
