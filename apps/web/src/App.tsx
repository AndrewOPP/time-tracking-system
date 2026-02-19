import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@/shared/config/router';
import { Toaster } from '@/shared/components/ui';
import { useEffect, useState } from 'react';
import { useAuthStore } from './modules/auth/stores/auth.store';
import { tokenRefresh } from './modules/auth/api/auth.api';
import { useInitAuth } from '@hooks/useInitAuth';

export function App() {
  const { setStatus, setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const init = async () => {
    try {
      console.log('test');
    } catch {
      console.log('err');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []); // П

  // useInitAuth();
  // console.log(12313123);

  return (
    <>
      {/* <Toaster /> */}
      {/* <BrowserRouter>
        <AppRouter />
      </BrowserRouter> */}
      <div>1231</div>
    </>
  );
}

export default App;
