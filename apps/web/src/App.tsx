import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@/shared/config/router';
import { Toaster } from '@/shared/components/ui';
import { useEffect, useState } from 'react';
import { useAuthStore } from './modules/auth/stores/auth.store';
import { tokenRefresh } from './modules/auth/api/auth.api';
import Loader from '@components/Loader';

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
    <>
      <Toaster />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>
  );
}

export default App;
