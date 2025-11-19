import React from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import AuthProvider from './context/AuthContext.jsx'

const queryClient = new QueryClient()

// ReactDOM.createRoot(document.getElementById('root').render(
  
// ))

createRoot(document.getElementById('root')).render(
 <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="bottom-center" toastOptions={{
        duration: 3000,
        style: {
          background: '#29353C',
          color: '#fff',
        },
      }}
      />
   <AuthProvider>
       <App />
   </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)