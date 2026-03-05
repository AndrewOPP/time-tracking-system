import { Module } from '@nestjs/common';
import { PrismaModule } from '@time-tracking-app/database/index';
import { AuthModule } from 'src/auth/auth.module';
import { TimeLogsService } from './timeLogs.service';
import { TimeLogsController } from './timeLogs.controller';
import { ConfigModule } from '@nestjs/config';
import { TimeLogCommandsService } from './serviceHelpers/timeLogs.commands.service';
import { TimeLogQueriesService } from './serviceHelpers/timeLogs.queries.service';

@Module({
  imports: [PrismaModule, AuthModule, ConfigModule],
  providers: [TimeLogsService, TimeLogCommandsService, TimeLogQueriesService],
  controllers: [TimeLogsController],
})
export class TimeLogsModule {}
