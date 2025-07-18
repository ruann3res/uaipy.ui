import { ThemeProvider } from "./contexts/theme";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from "./contexts/auth";
import { Router } from "./routes/Router";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 10, // 10 minutos
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
          <Toaster />
          <ReactQueryDevtools  buttonPosition="bottom-left" />
        </ThemeProvider>
    </AuthProvider>
      </QueryClientProvider>
  )
}