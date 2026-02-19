import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loginWithProvider } from '../api/auth.api';
import { ROUTES } from '@/shared/constants/routes';
import { AUTH_STORAGE_KEYS, OAUTH_EVENT_TYPES, type AuthProvider } from '../types/auth.types';
import axios from 'axios';

export function OAuthCallback() {
  const [params] = useSearchParams();
  const hasExchangedCode = useRef(false);
  useEffect(() => {
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    const savedState = sessionStorage.getItem(AUTH_STORAGE_KEYS.STATE);
    const provider = sessionStorage.getItem(AUTH_STORAGE_KEYS.PROVIDER);

    if (!window.opener) {
      return;
    }

    if (error) {
      window.opener.postMessage({ type: OAUTH_EVENT_TYPES.ERROR, error }, window.location.origin);
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.STATE);
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.PROVIDER);
      window.close();
      return;
    }

    const isValid = code && state && state === savedState && provider;

    if (!isValid) {
      console.error('Validation failed:', { code, state, savedState, provider });
      window.opener.postMessage({ type: OAUTH_EVENT_TYPES.ERROR }, window.location.origin);
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.STATE);
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.PROVIDER);
      window.close();
      return;
    }

    const exchangeCode = async () => {
      if (hasExchangedCode.current) return;
      hasExchangedCode.current = true;
      try {
        const response = await loginWithProvider(provider as AuthProvider, { code });
        window.opener.postMessage(
          { type: OAUTH_EVENT_TYPES.SUCCESS, payload: response },
          window.location.origin
        );
      } catch (err: unknown) {
        let serverMessage = 'auth_failed';

        if (axios.isAxiosError(err)) {
          serverMessage = err.response?.data?.message || 'server_error';
        }

        window.opener.postMessage(
          { type: OAUTH_EVENT_TYPES.ERROR, error: serverMessage },
          window.location.origin
        );
      } finally {
        sessionStorage.removeItem(AUTH_STORAGE_KEYS.STATE);
        sessionStorage.removeItem(AUTH_STORAGE_KEYS.PROVIDER);
        window.close();
      }
    };

    exchangeCode();
  }, [params]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p className="text-sm text-gray-500">Please wait...</p>
      </div>
    </div>
  );
}
