import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/ToastProvider';
import { AppRoutes } from './routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 20_000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
