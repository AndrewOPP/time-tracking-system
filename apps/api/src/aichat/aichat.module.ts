import { Module } from '@nestjs/common';
import { AichatService } from './aichat.service';
import { AichatController } from './aichat.controller';
import { PrismaModule } from '@time-tracking-app/database/index';

@Module({
  imports: [PrismaModule],
  providers: [AichatService],
  controllers: [AichatController],
})
export class AichatModule {}
