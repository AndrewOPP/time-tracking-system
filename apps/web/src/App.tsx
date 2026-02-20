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

  const init = async () => {
    try {
      const res = await tokenRefresh();
      if (res) {
        setAuth(res.data.user, res.data.accessToken);
      }
    } catch {
      return null;
    } finally {
      setIsthLoading(false);
    }
  };

  useEffect(() => {
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
