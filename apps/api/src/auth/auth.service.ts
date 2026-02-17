import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import {
  AUTH_PROVIDERS,
  AuthProvider,
  IOAuthNormalizeProfile,
  IOAuthProfile,
  OAuthConfig,
} from './types/oauth.types';
import { PrismaService } from '@time-tracking-app/database/index';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly providers: Record<AuthProvider, OAuthConfig>;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {
    this.providers = this.createProviders();
  }

  private createProviders(): Record<AuthProvider, OAuthConfig> {
    return {
      [AUTH_PROVIDERS.GITHUB]: {
        tokenUrl: 'https://github.com/login/oauth/access_token',
        profileUrl: 'https://api.github.com/user',
        clientId: this.getEnvOrThrow('GITHUB_CLIENT_ID'),
        clientSecret: this.getEnvOrThrow('GITHUB_CLIENT_SECRET'),
        useFormData: false,
      },
      [AUTH_PROVIDERS.DISCORD]: {
        tokenUrl: 'https://discord.com/api/oauth2/token',
        profileUrl: 'https://discord.com/api/users/@me',
        clientId: this.getEnvOrThrow('DISCORD_CLIENT_ID'),
        clientSecret: this.getEnvOrThrow('DISCORD_CLIENT_SECRET'),
        useFormData: true,
      },
      [AUTH_PROVIDERS.LINKEDIN]: {
        tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
        profileUrl: 'https://api.linkedin.com/v2/userinfo',
        clientId: this.getEnvOrThrow('LINKEDIN_CLIENT_ID'),
        clientSecret: this.getEnvOrThrow('LINKEDIN_CLIENT_SECRET'),
        useFormData: true,
      },
      [AUTH_PROVIDERS.GOOGLE]: {
        tokenUrl: 'https://oauth2.googleapis.com/token',
        profileUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
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

  async exchangeCodeForToken(provider: AuthProvider, code: string): Promise<string> {
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

  async fetchUsersProfile(provider: AuthProvider, accessToken: string) {
    const config = this.providers[provider];

    try {
      const response = await firstValueFrom(
        this.httpService.get(config.profileUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'User-Agent': 'NestJS-Auth-App',
          },
        })
      );

      return this.normalizeProfile(provider, response.data);
    } catch (error) {
      throw new UnauthorizedException(
        `Failed to fetch user profile from ${provider}, error: ${error}`
      );
    }
  }

  private normalizeProfile(provider: AuthProvider, data: IOAuthProfile): IOAuthNormalizeProfile {
    const email = data.email;
    const fallbackName = email ? email.split('@')[0] : 'User';

    let result: Partial<IOAuthNormalizeProfile>;

    switch (provider) {
      case AUTH_PROVIDERS.GOOGLE:
      case AUTH_PROVIDERS.LINKEDIN:
        result = {
          id: data.sub,
          email: data.email,
          name: data.name || fallbackName,
          picture: data.picture,
        };
        break;
      case AUTH_PROVIDERS.GITHUB:
        result = {
          id: String(data.id),
          email: data.email,
          name: data.name || data.login || fallbackName,
          picture: data.avatar_url,
        };
        break;
      case AUTH_PROVIDERS.DISCORD:
        result = {
          id: data.id,
          email: data.email,
          name: data.global_name || data.username || fallbackName,
          picture:
            data.id && data.avatar
              ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
              : undefined,
        };
        break;
      default:
        throw new Error('Unsupported provider');
    }

    if (!result.id || !result.email) {
      throw new UnauthorizedException(`Incomplete profile from ${provider}`);
    }

    return result as IOAuthNormalizeProfile;
  }

  async validateUser(provider: AuthProvider, profile: IOAuthNormalizeProfile) {
    let user = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          realName: profile.name,
          provider: provider,
          providerId: profile.id,
          isActive: false,
          status: 'INACTIVE',
          workFormat: 'FULL_TIME',
          systemRole: 'EMPLOYEE',
        },
      });
    } else {
      console.log('I found user in database, his email is,', user.email);
    }

    // if (!user.isActive) {
    //   // Якщо юзер вже є, але адмін ще не натиснув "активувати"
    //   throw new UnauthorizedException(
    //     'Your account is under moderation. Please contact the administrator.'
    //   );
    // }

    return user;
  }

  async getTokens(userId: string, email: string, role: string) {
    const jwtPayload = {
      sub: userId,
      email: email,
      role: role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(refreshToken, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash },
    });
  }
}
