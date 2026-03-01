import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@/shared/config/router';
import { Toaster } from '@/shared/components/ui';
import { useEffect, useState } from 'react';
import { useAuthStore } from './modules/auth/stores/auth.store';
import { tokenRefresh } from './modules/auth/api/auth.api';
import Loader from '@components/Loader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TooltipProvider } from '@ui/tooltip';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,

      retry: 1,
    },
  },
});

export function App() {
  const { setAuth } = useAuthStore();
  const [isLoading, setIsthLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await tokenRefresh();

      if (data) {
        setAuth(data.user, data.accessToken);
      }

      setIsthLoading(false);
    };

    init();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <TooltipProvider delayDuration={300}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </TooltipProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
