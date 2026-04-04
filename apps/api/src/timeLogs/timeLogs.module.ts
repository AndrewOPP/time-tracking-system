import { Module } from '@nestjs/common';
import { PrismaModule } from '@time-tracking-app/database/index';
import { TimeLogsService } from './timeLogs.service';
import { TimeLogsController } from './timeLogs.controller';
import { TimeLogCommandsService } from './serviceHelpers/timeLogs.commands.service';
import { TimeLogQueriesService } from './serviceHelpers/timeLogs.queries.service';

import { TimeLogsReminderService } from './timeLogsReminder.service';
import { TimeLogsCronService } from './timeLogsCron.service';
import { LoggerModule } from '../common/logger/logger.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule, LoggerModule],
  providers: [
    TimeLogsService,
    TimeLogCommandsService,
    TimeLogQueriesService,
    TimeLogsReminderService,
    TimeLogsCronService,
  ],
  controllers: [TimeLogsController],
})
export class TimeLogsModule {}
