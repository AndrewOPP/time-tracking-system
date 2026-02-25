import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Get('health')
  @UseGuards(JwtAuthGuard)
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
