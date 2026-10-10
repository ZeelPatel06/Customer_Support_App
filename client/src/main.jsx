import { StrictMode } from 'react'
import { router } from "./app/app.routes.jsx"
import { createRoot } from 'react-dom/client'
import './app/index.css'
import { RouterProvider } from 'react-router'

import QueryProvider from "./features/context/QueryProvider.jsx";
import AppToaster from './features/Shared/AppToaster.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppToaster />
    <QueryProvider>
    <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>,
)
