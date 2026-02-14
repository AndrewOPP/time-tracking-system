import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async handleGithubLogin(code: string) {
    try {
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
        }),
      });

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      if (!accessToken) throw new Error('Failed to get access token from GitHub');

      return accessToken;
    } catch (error) {
      console.log('Failed to get access token from GitHub', error);
    }
  }
}
