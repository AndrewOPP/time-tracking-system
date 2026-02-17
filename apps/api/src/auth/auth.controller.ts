import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AUTH_PROVIDERS, AuthProvider } from './types/oauth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(':provider')
  async exchangeToken(@Param('provider') provider: AuthProvider, @Body() body: { code: string }) {
    if (!body.code) {
      throw new BadRequestException('Authorization code is required');
    }

    const providerUpper = provider.toUpperCase() as AuthProvider;

    if (!Object.values(AUTH_PROVIDERS).includes(providerUpper as AuthProvider)) {
      throw new BadRequestException('Invalid OAuth provider');
    }

    const accessToken = await this.authService.exchangeCodeForToken(
      providerUpper as AuthProvider,
      body.code
    );

    if (accessToken) {
      const userData = await this.authService.fetchUsersProfile(providerUpper, accessToken);
      // console.log(`Access token received from ${providerUpper}: ${accessToken}`);
      // console.log(`userData received from  ${providerUpper}:`, userData);
      const user = await this.authService.validateUser(providerUpper, userData);
      console.log(`user created, for  ${providerUpper}:`, user);

      return {
        status: 'success',
        provider,
        message: 'Access token received',
      };
    }
  }
}
