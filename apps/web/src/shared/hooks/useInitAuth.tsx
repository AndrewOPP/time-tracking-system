import { tokenRefresh } from '@/modules/auth/api/auth.api';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { useEffect } from 'react';

export const useInitAuth = () => {
  const setAuth = useAuthStore(state => state.setAuth);
  const setStatus = useAuthStore(state => state.setStatus);
  useEffect(() => {
    console.log(123213132);
  }, []); // П

  useEffect(() => {
    const init = async () => {
      setStatus('loading');
      try {
        const res = await tokenRefresh();
        setAuth(res.data.user, res.data.accessToken);
        setStatus('authenticated');
      } catch {
        setStatus('unauthenticated');
      }
    };

    init();
  }, []);
};
