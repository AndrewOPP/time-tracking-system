import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@/shared/config/router';
import { Toaster } from '@/shared/components/ui';
import { useEffect, useState } from 'react';
import { useAuthStore } from './modules/auth/stores/auth.store';
import { tokenRefresh } from './modules/auth/api/auth.api';

export function App() {
  const { setAuth } = useAuthStore();
  const [isLoading, setIsthLoading] = useState(true);

  const init = async () => {
    try {
      const res = await tokenRefresh();
      console.log(res);
      if (res) {
        setAuth(res.data.user, res.data.accessToken);
      }
    } finally {
      setIsthLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  if (isLoading) {
    return <div>Is loading</div>;
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
