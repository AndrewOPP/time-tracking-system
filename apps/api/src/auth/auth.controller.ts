import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OAuthProvider } from './types/oauth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async handleGoogleToken(@Body() body: { code: string }) {
    const accessToken = await this.authService.exchangeCodeForToken(
      OAuthProvider.GOOGLE,
      body.code
    );
    if (accessToken) {
      console.log('Google access token:', accessToken);
      return {
        status: 'success',
        message: 'Token is received',
      };
    }
  }

  @Post('github')
  async handleGithubToken(@Body() body: { code: string }) {
    const accessToken = await this.authService.exchangeCodeForToken(
      OAuthProvider.GITHUB,
      body.code
    );

    if (accessToken) {
      console.log('Github access token:', accessToken);
      return {
        status: 'success',
        message: 'Token is received',
      };
    }
  }

  @Post('discord')
  async handleDiscordToken(@Body() body: { code: string }) {
    const accessToken = await this.authService.exchangeCodeForToken(
      OAuthProvider.DISCORD,
      body.code
    );
    if (accessToken) {
      console.log('Discord access token:', accessToken);
      return {
        status: 'success',
        message: 'Token is received',
      };
    }
  }

  @Post('linkedin')
  async handleLinkedinToken(@Body() body: { code: string }) {
    const accessToken = await this.authService.exchangeCodeForToken(
      OAuthProvider.LINKEDIN,
      body.code
    );

    if (accessToken) {
      console.log('Linkedin access token:', accessToken);
      return {
        status: 'success',
        message: 'Token is received',
      };
    }
  }
}
