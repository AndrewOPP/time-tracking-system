import { GoogleLogin } from '@react-oauth/google';

export default function GoogleLoginButton() {
  return (
    <GoogleLogin
      onSuccess={credentialResponse => {
        console.log('Успішна авторизація! Токен:', credentialResponse);
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
