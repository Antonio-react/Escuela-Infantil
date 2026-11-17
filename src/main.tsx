import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import '@fontsource-variable/fredoka'
import '@fontsource-variable/nunito'
import '@fontsource/patrick-hand' // letra de tiza (menú de móvil): solo se descarga cuando se usa
import './index.css'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
