import { Module } from '@nestjs/common';
import { PrismaModule } from '@time-tracking-app/database/index';
import { AuthModule } from 'src/auth/auth.module';
import { TimeLogsService } from './timeLogs.service';
import { TimeLogsController } from './timeLogs.controller';
import { TimeLogCommandsService } from './serviceHelpers/timeLogs.commands.service';
import { TimeLogQueriesService } from './serviceHelpers/timeLogs.queries.service';

import { LoggerModule } from 'src/common/logger/logger.module';
import { TimeLogsReminderService } from './timeLogsReminder.service';
import { TimeLogsCronService } from './timeLogsCron.service';

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
