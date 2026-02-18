import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { AuthProviders, OAuthConfig } from './types/oauth.types';

@Injectable()
export class AuthService {
  private readonly providers: Record<AuthProviders, OAuthConfig>;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.providers = this.createProviders();
  }

  private createProviders(): Record<AuthProviders, OAuthConfig> {
    return {
      [AuthProviders.GITHUB]: {
        tokenUrl: 'https://github.com/login/oauth/access_token',
        clientId: this.getEnvOrThrow('GITHUB_CLIENT_ID'),
        clientSecret: this.getEnvOrThrow('GITHUB_CLIENT_SECRET'),
        useFormData: false,
      },
      [AuthProviders.DISCORD]: {
        tokenUrl: 'https://discord.com/api/oauth2/token',
        clientId: this.getEnvOrThrow('DISCORD_CLIENT_ID'),
        clientSecret: this.getEnvOrThrow('DISCORD_CLIENT_SECRET'),
        useFormData: true,
      },
      [AuthProviders.LINKEDIN]: {
        tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
        clientId: this.getEnvOrThrow('LINKEDIN_CLIENT_ID'),
        clientSecret: this.getEnvOrThrow('LINKEDIN_CLIENT_SECRET'),
        useFormData: true,
      },
      [AuthProviders.GOOGLE]: {
        tokenUrl: 'https://oauth2.googleapis.com/token',
        clientId: this.getEnvOrThrow('GOOGLE_CLIENT_ID'),
        clientSecret: this.getEnvOrThrow('GOOGLE_CLIENT_SECRET'),
        useFormData: true,
      },
    };
  }

  private getEnvOrThrow(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new InternalServerErrorException(`Environment variable ${key} is not defined`);
    }
    return value;
  }

  async exchangeCodeForToken(provider: AuthProviders, code: string): Promise<string> {
    const config = this.providers[provider];

    if (!config) {
      throw new InternalServerErrorException(`OAuth provider ${provider} is not configured`);
    }

    return this.exchangeCode(code, config);
  }

  private async exchangeCode(code: string, config: OAuthConfig): Promise<string> {
    const redirectUri = this.getEnvOrThrow('OAUTH_REDIRECT_URI');

    const payload = config.useFormData
      ? new URLSearchParams({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
        })
      : {
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code,
        };

    try {
      const response = await firstValueFrom(
        this.httpService.post(config.tokenUrl, payload, {
          headers: {
            Accept: 'application/json',
          },
        })
      );

      const accessToken = response.data?.access_token;

      if (!accessToken) {
        throw new UnauthorizedException(
          `Failed to retrieve access token: ${response.data?.error_description || 'Invalid authorization code'}`
        );
      }

      return accessToken;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.error_description || error.response?.data?.error || error.message;

        throw new UnauthorizedException(`OAuth request failed: ${message}`);
      }

      throw new InternalServerErrorException(
        `OAuth request error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
