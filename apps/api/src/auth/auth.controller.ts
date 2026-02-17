import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AUTH_PROVIDERS, AuthProvider } from './types/oauth.types';
import { Response } from 'express';
import { Res } from '@nestjs/common';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(':provider')
  async exchangeToken(
    @Param('provider') provider: AuthProvider,
    @Body() body: { code: string },
    @Res({ passthrough: true }) res: Response
  ) {
    if (!body.code) {
      throw new BadRequestException('Authorization code is required');
    }

    const providerUpper = provider.toUpperCase() as AuthProvider;

    if (!Object.values(AUTH_PROVIDERS).includes(providerUpper as AuthProvider)) {
      throw new BadRequestException('Invalid OAuth provider');
    }

    const providerToken = await this.authService.exchangeCodeForToken(providerUpper, body.code);
    const profile = await this.authService.fetchUsersProfile(providerUpper, providerToken);

    const user = await this.authService.validateUser(providerUpper, profile);

    const tokens = await this.authService.getTokens(user.id, user.email, user.systemRole);
    console.log(tokens);

    await this.authService.updateRefreshTokenHash(user.id, tokens.refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.systemRole,
      },
    };
  }
}
