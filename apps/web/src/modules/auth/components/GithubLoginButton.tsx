export default function GithubLoginButton() {
  const handleLogin = () => {
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('oauth_provider', 'github');
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/login`;
    const scope = 'user:email';

    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

    window.location.href = githubUrl;
  };

  return <button onClick={handleLogin}>Войти через GitHub</button>;
}
