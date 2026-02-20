import { HttpService } from '@nestjs/axios';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import {
  IOAuthNormalizeProfile,
  IOAuthProfile,
  AuthProviders,
  OAuthConfig,
  AuthError,
  JWT_CONFIG,
  CookieName,
  AUTH_ERROR_MESSAGES,
} from './types/oauth.types';
import { Response } from 'express';
import { PrismaService } from '@time-tracking-app/database/index';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly providers: Record<AuthProviders, OAuthConfig>;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {
    this.providers = this.createProviders();
  }

  private createProviders(): Record<AuthProviders, OAuthConfig> {
    return {
      [AuthProviders.GITHUB]: {
        tokenUrl: 'https://github.com/login/oauth/access_token',
        profileUrl: 'https://api.github.com/user',
        clientId: this.getEnvOrThrow('GITHUB_CLIENT_ID'),
        clientSecret: this.getEnvOrThrow('GITHUB_CLIENT_SECRET'),
        useFormData: false,
      },
      [AuthProviders.DISCORD]: {
        tokenUrl: 'https://discord.com/api/oauth2/token',
        profileUrl: 'https://discord.com/api/users/@me',
        clientId: this.getEnvOrThrow('DISCORD_CLIENT_ID'),
        clientSecret: this.getEnvOrThrow('DISCORD_CLIENT_SECRET'),
        useFormData: true,
      },
      [AuthProviders.LINKEDIN]: {
        tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
        profileUrl: 'https://api.linkedin.com/v2/userinfo',
        clientId: this.getEnvOrThrow('LINKEDIN_CLIENT_ID'),
        clientSecret: this.getEnvOrThrow('LINKEDIN_CLIENT_SECRET'),
        useFormData: true,
      },
      [AuthProviders.GOOGLE]: {
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
      throw new InternalServerErrorException(AUTH_ERROR_MESSAGES.ENV_MISSING(key));
    }
    return value;
  }

  async exchangeCodeForToken(provider: AuthProviders, code: string): Promise<string> {
    const config = this.providers[provider];

    if (!config) {
      throw new InternalServerErrorException(AUTH_ERROR_MESSAGES.PROVIDER_NOT_CONFIGURED(provider));
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
        const details = response.data?.error_description || AuthError.INVALID_AUTH_CODE;
        throw new UnauthorizedException(AUTH_ERROR_MESSAGES.TOKEN_RETRIEVAL_FAILED(details));
      }

      return accessToken;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.error_description || error.response?.data?.error || error.message;

        throw new UnauthorizedException(AUTH_ERROR_MESSAGES.OAUTH_REQUEST_FAILED(message));
      }

      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(AUTH_ERROR_MESSAGES.OAUTH_UNKNOWN_ERROR(errorMessage));
    }
  }

  async fetchUsersProfile(provider: AuthProviders, accessToken: string) {
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
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.PROFILE_FETCH_FAILED(provider, error));
    }
  }

  private normalizeProfile(provider: AuthProviders, data: IOAuthProfile): IOAuthNormalizeProfile {
    const email = data.email;
    const fallbackName = email ? email.split('@')[0] : 'User';

    let result: Partial<IOAuthNormalizeProfile>;

    switch (provider) {
      case AuthProviders.GOOGLE:
      case AuthProviders.LINKEDIN:
        result = {
          id: data.sub,
          email: data.email,
          name: data.name || fallbackName,
          picture: data.picture,
        };
        break;
      case AuthProviders.GITHUB:
        result = {
          id: String(data.id),
          email: data.email,
          name: data.name || data.login || fallbackName,
          picture: data.avatar_url,
        };
        break;
      case AuthProviders.DISCORD:
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
        throw new Error(AuthError.INVALID_PROVIDER);
    }

    if (!result.id || !result.email) {
      throw new UnauthorizedException(AuthError.INCOMPLETE_PROFILE + provider);
    }

    return result as IOAuthNormalizeProfile;
  }

  async validateUser(provider: AuthProviders, profile: IOAuthNormalizeProfile) {
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
    }

    if (!user.isActive) {
      throw new UnauthorizedException(AuthError.MODERATION);
    }

    return user;
  }

  async getTokens(userId: string, email: string, role: string, res: Response) {
    const jwtPayload = {
      sub: userId,
      email: email,
      role: role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: JWT_CONFIG.ACCESS_EXPIRES,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: JWT_CONFIG.REFRESH_EXPIRES,
      }),
    ]);

    this.setRefreshCookie(res, refreshToken);

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

  async refreshTokens(refreshToken: string, res: Response) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.refreshTokenHash) {
        throw new ForbiddenException(AuthError.ACCESS_DENIED);
      }

      const rtMatches = await bcrypt.compare(refreshToken, user.refreshTokenHash);

      if (!rtMatches) {
        throw new ForbiddenException(AuthError.ACCESS_DENIED);
      }

      const tokens = await this.getTokens(user.id, user.email, user.systemRole, res);

      await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

      return {
        accessToken: tokens.accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.systemRole,
        },
      };
    } catch {
      throw new UnauthorizedException(AuthError.SESSION_EXPIRED);
    }
  }

  async logout(userId: string, res: Response) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshTokenHash: null },
      });
    } catch (error) {
      console.error('Logout DB Error:', error);
    } finally {
      res.clearCookie(CookieName.REFRESH_TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }

    return { success: true };
  }

  private setRefreshCookie(res: Response, refreshToken: string) {
    res.cookie(CookieName.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: JWT_CONFIG.REFRESH_MAX_AGE,
    });
  }
}
