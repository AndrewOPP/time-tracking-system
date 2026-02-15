import { firstCharToUpperCase } from '@/shared/utils/firstCharToUpperCase';
import { useOAuth } from '../hooks/useOAuth';
import type { OAuthLoginButtonProps } from '../types/auth.types';

export function OAuthLoginButton({ provider }: OAuthLoginButtonProps) {
  const { openPopup } = useOAuth(provider);
  const providerName = firstCharToUpperCase(provider);

  return <button onClick={openPopup}>Sign in with {providerName}</button>;
}
