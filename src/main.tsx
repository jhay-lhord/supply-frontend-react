import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
import App from './App.tsx'
import './index.css'
import { Toaster } from './components/ui/toaster.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <App />
    <Toaster/>
    <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
    
  </StrictMode>,
)
