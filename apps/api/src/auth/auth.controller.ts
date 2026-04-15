import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { AuthError, AuthProviders, CookieName, RequestWithUser } from './types/oauth.types';
import { Response, Request } from 'express';
import { Res } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('guest')
  async guestLogin(@Res({ passthrough: true }) res: Response, @Query('guestId') guestId: string) {
    return await this.authService.loginAsGuest(res, guestId);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req.user.sub, res);
  }

  @Post(':provider')
  async exchangeToken(
    @Param('provider') provider: AuthProviders,
    @Body() body: { code: string },
    @Res({ passthrough: true }) res: Response
  ) {
    if (!body.code) {
      throw new BadRequestException(AuthError.AUTHORIZATION_REQUIRED);
    }

    const providerUpper = provider.toUpperCase() as AuthProviders;

    if (!Object.values(AuthProviders).includes(providerUpper as AuthProviders)) {
      throw new BadRequestException(AuthError.INVALID_PROVIDER);
    }

    const providerToken = await this.authService.exchangeCodeForToken(providerUpper, body.code);

    const profile = await this.authService.fetchUsersProfile(providerUpper, providerToken);

    const user = await this.authService.validateUser(providerUpper, profile);

    const tokens = await this.authService.getTokens(user.id, user.email, user.systemRole, res);

    await this.authService.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.systemRole,
        isActive: user.isActive,
      },
    };
  }

  @Get('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies[CookieName.REFRESH_TOKEN];
    if (!refreshToken) {
      throw new UnauthorizedException(AuthError.TOKEN_NOT_FOUND);
    }
    return this.authService.refreshTokens(refreshToken, res);
  }
}
