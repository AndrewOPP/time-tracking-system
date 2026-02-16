import { useEffect, useRef } from 'react';
import { useToast } from '@hooks/use-toast';
import { oauthConfig } from '../utils/oauthConfig';

import { ROUTES } from '@/shared/constants/routes';
import {
  AUTH_NOTIFICATIONS,
  AUTH_STORAGE_KEYS,
  OAUTH_EVENT_TYPES,
  type AuthProvider,
} from '../types/auth.types';

export function useOAuth(provider: AuthProvider, setGlobalLoading: (v: boolean) => void) {
  const { toast } = useToast();
  const popupRef = useRef<Window | null>(null);
  const authFinishedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkPopupClosed = () => {
    intervalRef.current = setInterval(() => {
      if (!popupRef.current || popupRef.current.closed) {
        if (intervalRef.current) clearInterval(intervalRef.current);

        if (!authFinishedRef.current) {
          setGlobalLoading(false);
          toast({
            variant: 'destructive',
            title: AUTH_NOTIFICATIONS.CONTENT.CANCELED,
          });
        }
      }
    }, 500);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const { type, error } = event.data;

      if (type === OAUTH_EVENT_TYPES.SUCCESS) {
        authFinishedRef.current = true;
        setGlobalLoading(false);
        toast({ title: AUTH_NOTIFICATIONS.CONTENT.SUCCESS });
        popupRef.current?.close();
      }

      if (type === OAUTH_EVENT_TYPES.ERROR) {
        authFinishedRef.current = true;
        setGlobalLoading(false);

        const isCanceled = error === 'access_denied';
        toast({
          variant: 'destructive',
          title: isCanceled
            ? AUTH_NOTIFICATIONS.CONTENT.CANCELED
            : AUTH_NOTIFICATIONS.CONTENT.ERROR,
        });

        popupRef.current?.close();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setGlobalLoading(false);
    };
  }, [toast, setGlobalLoading]);

  const openPopup = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setGlobalLoading(true);
    authFinishedRef.current = false;

    const state = crypto.randomUUID();
    sessionStorage.setItem(AUTH_STORAGE_KEYS.STATE, state);
    sessionStorage.setItem(AUTH_STORAGE_KEYS.PROVIDER, provider);

    const redirectUri = `${window.location.origin}${ROUTES.AUTH.CALLBACK}`;
    const config = oauthConfig[provider];

    const url = `${config.authUrl}?response_type=code&client_id=${config.clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(config.scope)}&state=${state}${config.extraParams ?? ''}`;

    popupRef.current = window.open(url, 'oauth_popup', 'width=500,height=600');
    checkPopupClosed();
  };

  return { openPopup };
}
