import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async handleGoogleToken(@Body() body: { token: string }) {
    console.log('Token is received Token:', body.token);

    return {
      status: 'success',
      message: 'Token is received',
    };
  }

  @Post('github')
  async handleGithubToken(@Body() body: { code: string }) {
    const accessToken = await this.authService.handleGithubLogin(body.code);

    console.log('Github access token:', accessToken);
    if (accessToken) {
      return {
        status: 'success',
        message: 'Token is received',
      };
    }
  }
}
