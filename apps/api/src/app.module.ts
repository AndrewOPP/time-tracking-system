import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@time-tracking-app/database';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { AppController } from './app.controller';
import { AichatModule } from './aichat/aichat.module';
import { TimeLogsModule } from './timeLogs/timeLogs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from './common/logger/logger.module';
import { UserModule } from './users/users.module';
import { ManagerDashboardModule } from './manager-dashboard/manager-dashboard.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 3600000,
        limit: 30,
      },
    ]),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    AichatModule,
    TimeLogsModule,
    LoggerModule,
    UserModule,
    ManagerDashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
