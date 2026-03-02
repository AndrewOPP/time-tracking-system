import { Module } from '@nestjs/common';
import { AichatService } from './aichat.service';
import { AichatController } from './aichat.controller';
import { PrismaModule } from '@time-tracking-app/database/index';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, AuthModule, ConfigModule],
  providers: [AichatService],
  controllers: [AichatController],
})
export class AichatModule {}
