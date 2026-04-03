import { Module } from '@nestjs/common';
import { AichatService } from './aichat.service';
import { AichatController } from './aichat.controller';
import { PrismaModule } from '@time-tracking-app/database/index';
import { ConfigModule } from '@nestjs/config';
import { AichatToolsService } from './aichat-tools.service';
import { AichatRepository } from './aichat.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule, ConfigModule],
  providers: [AichatService, AichatToolsService, AichatRepository],
  controllers: [AichatController],
})
export class AichatModule {}
