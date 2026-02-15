import { OAuthLoginButton } from '../components/OAuthLoginButton';
import { AUTH_PROVIDERS } from '../types/auth.types';

export default function LoginPage() {
  return (
    <div>
      <div>VISO TIME TRACKER</div>
      <div>
        <p>Hello</p>
        <p>
          Hello world - <span>Another world</span>
        </p>
        <div>
          <OAuthLoginButton provider={AUTH_PROVIDERS.GOOGLE} />
          <div>
            <OAuthLoginButton provider={AUTH_PROVIDERS.DISCORD} />
          </div>
          <div>
            <OAuthLoginButton provider={AUTH_PROVIDERS.GITHUB} />
          </div>

          <OAuthLoginButton provider={AUTH_PROVIDERS.LINKEDIN} />
        </div>
      </div>
    </div>
  );
}
