import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { AuthProviders } from './types/oauth.types';
import { Response, Request } from 'express';
import { Res } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(':provider')
  async exchangeToken(
    @Param('provider') provider: AuthProviders,
    @Body() body: { code: string },
    @Res({ passthrough: true }) res: Response
  ) {
    if (!body.code) {
      throw new BadRequestException('Authorization code is required');
    }

    const providerUpper = provider.toUpperCase() as AuthProviders;

    if (!Object.values(AuthProviders).includes(providerUpper as AuthProviders)) {
      throw new BadRequestException('Invalid OAuth provider');
    }

    const providerToken = await this.authService.exchangeCodeForToken(providerUpper, body.code);
    const profile = await this.authService.fetchUsersProfile(providerUpper, providerToken);

    const user = await this.authService.validateUser(providerUpper, profile);

    const tokens = await this.authService.getTokens(user.id, user.email, user.systemRole);

    await this.authService.updateRefreshTokenHash(user.id, tokens.refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
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

  @Get('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    console.log('im here');

    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    return this.authService.refreshTokens(refreshToken, res);
  }
}
