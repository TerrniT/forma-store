import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import '@fontsource-variable/inter'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import './styles/main.css'
import { router } from './router.jsx'
import { CatalogProvider } from './store/CatalogContext.jsx'
import { CartProvider } from './store/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CatalogProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </CatalogProvider>
  </StrictMode>,
)
