import { firstCharToUpperCase } from '@/shared/utils/firstCharToUpperCase';
import { useOAuth } from '../hooks/useOAuth';
import type { AuthProvider } from '../types/auth.types';

interface OAuthLoginButtonProps {
  provider: AuthProvider;
  className?: string;
  icon?: string;
  children?: React.ReactNode;
}

export function OAuthLoginButton({ provider, className, icon, children }: OAuthLoginButtonProps) {
  const { openPopup } = useOAuth(provider);
  const providerName = firstCharToUpperCase(provider);

  return (
    <button className={className} onClick={openPopup} type="button">
      {icon && <img src={icon} alt={`${providerName} icon`} className="w-5 h-5 object-contain" />}
      <span>{children || `Sign in with ${providerName}`}</span>
    </button>
  );
}
