import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OAuthProvider } from './types/oauth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(':provider')
  async exchangeToken(@Param('provider') provider: string, @Body() body: { code: string }) {
    if (!body.code) {
      throw new BadRequestException('Authorization code is required');
    }

    if (!Object.values(OAuthProvider).includes(provider as OAuthProvider)) {
      throw new BadRequestException('Invalid OAuth provider');
    }

    const accessToken = await this.authService.exchangeCodeForToken(
      provider as OAuthProvider,
      body.code
    );

    if (accessToken) {
      console.log(`Access token received from ${provider}: ${accessToken}`);

      return {
        status: 'success',
        provider,
        message: 'Access token received',
      };
    }
  }
}
