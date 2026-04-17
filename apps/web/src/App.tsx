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

  const [appStatus, setAppStatus] = useState<'loading' | 'waking_up' | 'ready'>('loading');

  useEffect(() => {
    const init = async () => {
      const wakeUpTimeout = setTimeout(() => {
        setAppStatus('waking_up');
      }, 3500);

      try {
        const { data } = await tokenRefresh();

        if (data) {
          setAuth(data.user, data.accessToken);
        }
      } catch (error) {
        console.error('Init error:', error);
      } finally {
        clearTimeout(wakeUpTimeout);
        setAppStatus('ready');
      }
    };

    init();
  }, []);

  if (appStatus === 'loading') {
    return <Loader />;
  }

  if (appStatus === 'waking_up') {
    return (
      <Loader
        title="The server is waking up..."
        description="The free server on Render goes to sleep after 15 minutes of inactivity. Startup usually takes 2–3 minutes."
        showBackendLink={true}
      />
    );
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
