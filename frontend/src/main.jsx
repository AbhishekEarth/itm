import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't retry when backend is down — 1 attempt max.
      // Individual hooks can override for critical data.
      retry: 0,
      // Keep data fresh for 5 min. Multiple components sharing the same
      // query key (e.g. home + header both calling usePublicPagesList)
      // will reuse the same cached response instead of each firing a request.
      staleTime: 5 * 60_000,
      // Keep unused data in cache for 10 min (helps navigating back to pages)
      gcTime: 10 * 60_000,
      // Don't re-fetch just because the user switched tabs and came back
      refetchOnWindowFocus: false,
      // Don't re-fetch on reconnect — static fallbacks handle offline gracefully
      refetchOnReconnect: false,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
