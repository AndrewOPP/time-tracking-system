import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthProviders } from './types/oauth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(':provider')
  async exchangeToken(@Param('provider') provider: string, @Body() body: { code: string }) {
    if (!body.code) {
      throw new BadRequestException('Authorization code is required');
    }

    if (!Object.values(AuthProviders).includes(provider as AuthProviders)) {
      throw new BadRequestException('Invalid OAuth provider');
    }

    const accessToken = await this.authService.exchangeCodeForToken(
      provider as AuthProviders,
      body.code
    );

    if (accessToken) {
      console.log(provider, 'accessToken', accessToken);

      return {
        status: 'success',
        provider,
        message: 'Access token received',
      };
    }
  }
}
