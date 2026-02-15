import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { OAuthConfig, OAuthProvider } from './types/oauth.types';

@Injectable()
export class AuthService {
  private providers: Record<OAuthProvider, OAuthConfig> = {
    [OAuthProvider.GITHUB]: {
      tokenUrl: 'https://github.com/login/oauth/access_token',
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    [OAuthProvider.DISCORD]: {
      tokenUrl: 'https://discord.com/api/oauth2/token',
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
    [OAuthProvider.LINKEDIN]: {
      tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    },
    [OAuthProvider.GOOGLE]: {
      tokenUrl: 'https://oauth2.googleapis.com/token',
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  };

  async exchangeCodeForToken(provider: OAuthProvider, code: string) {
    switch (provider) {
      case OAuthProvider.GITHUB:
        return this.exchangeGithubCode(code);

      case OAuthProvider.DISCORD:
        return this.exchangeDiscordOrLinkedInCode(code, OAuthProvider.DISCORD);

      case OAuthProvider.LINKEDIN:
        return this.exchangeDiscordOrLinkedInCode(code, OAuthProvider.LINKEDIN);

      case OAuthProvider.GOOGLE:
        return this.exchangeDiscordOrLinkedInCode(code, OAuthProvider.GOOGLE);

      default:
        throw new InternalServerErrorException('Unsupported OAuth provider');
    }
  }

  private async exchangeDiscordOrLinkedInCode(code: string, provider: OAuthProvider) {
    const config = this.providers[provider];

    const params = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: `http://localhost:5173/oauth/callback`,
    });

    try {
      const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });

      const data = await response.json();

      if (!response.ok || !data.access_token) {
        throw new UnauthorizedException(
          `Failed to get access token from ${provider}: ${data.error_description || 'Invalid code'}`
        );
      }

      return data.access_token;
    } catch (error) {
      throw new InternalServerErrorException(`${provider} request failed: ${error.message}`);
    }
  }

  private async exchangeGithubCode(code: string) {
    const config = this.providers[OAuthProvider.GITHUB];

    try {
      const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.access_token) {
        throw new UnauthorizedException(
          `Failed to get access token from GitHub: ${data.error_description || 'Invalid code'}`
        );
      }

      return data.access_token;
    } catch (error) {
      throw new InternalServerErrorException(`GitHub service unavailable: ${error.message}`);
    }
  }
}
