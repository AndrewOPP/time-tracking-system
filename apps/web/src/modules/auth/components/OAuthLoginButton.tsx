import { firstCharToUpperCase } from '@/shared/utils/firstCharToUpperCase';
import { useOAuth } from '../hooks/useOAuth';
import type { OAuthLoginButtonProps } from '../types/auth.types';

export function OAuthLoginButton({
  provider,
  className,
  icon,
  setGlobalLoading,
  isGlobalLoading,
  children,
}: OAuthLoginButtonProps) {
  const { openPopup } = useOAuth(provider, setGlobalLoading);
  const providerName = firstCharToUpperCase(provider);

  return (
    <button
      className={`${className} disabled:bg-primary/15 disabled:hover:brightness-75 disabled:cursor-not-allowed `}
      onClick={openPopup}
      type="button"
      disabled={isGlobalLoading}
    >
      {icon && <img src={icon} alt={`${providerName} icon`} className="w-5 h-5 object-contain" />}
      <span>{children || `Sign in with ${providerName}`}</span>
    </button>
  );
}
