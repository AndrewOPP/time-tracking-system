import { useEffect, useRef } from 'react';
import { useToast } from '@hooks/use-toast';
import { oauthConfig } from '../utils/oauthConfig';

import { ROUTES } from '@/shared/constants/routes';
import {
  AUTH_NOTIFICATIONS,
  AUTH_STORAGE_KEYS,
  OAUTH_EVENT_TYPES,
  type AuthProvider,
  type OAuthMessage,
} from '../types/auth.types';
import { useAuthStore } from '../stores/auth.store';
import { buildOAuthUrl } from '../utils/auth.utils';
import { getAuthErrorMessage } from '@/shared/utils/error-handler';
import { AUTH_ERROR_MAP } from '@/shared/constants/errors.messages';

export function useOAuth(provider: AuthProvider, setGlobalLoading: (v: boolean) => void) {
  const { toast } = useToast();
  const popupRef = useRef<Window | null>(null);
  const authFinishedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { setAuth } = useAuthStore();
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
    const handleMessage = (event: MessageEvent<OAuthMessage>) => {
      if (event.origin !== window.location.origin) return;

      const data = event.data;

      if (data.type === OAUTH_EVENT_TYPES.SUCCESS) {
        authFinishedRef.current = true;

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        setGlobalLoading(false);
        popupRef.current?.close();

        if (!data.payload) {
          toast({
            variant: 'destructive',
            title: AUTH_NOTIFICATIONS.CONTENT.ERROR,
            description: AUTH_ERROR_MAP.AUTH_MODERATION_REQUIRED,
          });
        } else {
          setAuth(data.payload.user, data.payload.accessToken);
        }
      }

      if (data.type === OAUTH_EVENT_TYPES.ERROR) {
        authFinishedRef.current = true;
        setGlobalLoading(false);

        const isCanceled = data.error === 'access_denied' || data.error === 'user_cancelled_login';

        toast({
          variant: 'destructive',
          title: isCanceled
            ? AUTH_NOTIFICATIONS.CONTENT.CANCELED
            : AUTH_NOTIFICATIONS.CONTENT.ERROR,
          description:
            data.error && isCanceled ? 'Access is denied by you' : getAuthErrorMessage(data.error),
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
  }, [toast, setGlobalLoading, setAuth]);

  const openPopup = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setGlobalLoading(true);
    authFinishedRef.current = false;

    const state = crypto.randomUUID();

    sessionStorage.setItem(AUTH_STORAGE_KEYS.STATE, state);
    sessionStorage.setItem(AUTH_STORAGE_KEYS.PROVIDER, provider);

    const redirectUri = `${window.location.origin}${ROUTES.OAUTH_CALLBACK}`;
    const config = oauthConfig[provider];

    const url = buildOAuthUrl({
      authUrl: config.authUrl,
      clientId: config.clientId,
      redirectUri,
      scope: config.scope,
      state,
      extraParams: config.extraParams,
    });

    popupRef.current = window.open(url, 'oauth_popup', 'width=500,height=600');
    checkPopupClosed();
  };

  return { openPopup };
}
