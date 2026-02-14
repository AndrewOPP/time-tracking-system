import { GoogleLogin } from '@react-oauth/google';
import { loginWithProvider } from '../api/auth.api';

export default function GoogleLoginButton() {
  return (
    <GoogleLogin
      onSuccess={credentialResponse => {
        const token = credentialResponse.credential;
        console.log('Успішна авторизація! Токен:', credentialResponse);
        if (token) {
          loginWithProvider('google', { token });
        }
      }}
      onError={() => {
        console.log('Помилка авторизації');
      }}
      useOneTap={false}
      shape="rectangular"
      theme="outline"
    />
  );
}
