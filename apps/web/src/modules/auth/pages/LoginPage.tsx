import { useSearchParams } from 'react-router-dom';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useEffect } from 'react';
import GithubLoginButton from '../components/GithubLoginButton';
import { loginWithProvider } from '../api/auth.api';
import type { AuthProvider } from '../types/auth.types';

export default function LoginPage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    const savedState = sessionStorage.getItem('oauth_state');
    const provider = sessionStorage.getItem('oauth_provider') as AuthProvider;

    if (code && state && provider) {
      if (state !== savedState) {
        console.error('Помилка: state відрізняється!');
        return;
      }

      sessionStorage.removeItem('oauth_state');
      sessionStorage.removeItem('oauth_provider');
      loginWithProvider(provider, { code });
    }
  }, [searchParams]);

  return (
    <div>
      <div>VISO TIME TRACKER</div>
      <div>
        <p>Вітаємо</p>
        <p>
          Hello world - <span>Another world</span>
        </p>
        <div>
          <GoogleLoginButton />
          <GithubLoginButton />
        </div>
      </div>
    </div>
  );
}
