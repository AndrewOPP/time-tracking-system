import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@time-tracking-app/database/index';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [HttpModule, ConfigModule, PrismaModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard],
  exports: [JwtAuthGuard, JwtModule, RolesGuard],
})
export class AuthModule {}
