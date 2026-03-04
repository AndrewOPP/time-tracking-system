import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@time-tracking-app/database';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { AppController } from './app.controller';
import { AichatModule } from './aichat/aichat.module';
import { TimeLogsController } from './timeLogs/timeLogs.controller';
import { TimeLogsService } from './timeLogs/timeLogs.service';
import { TimeLogsModule } from './timeLogs/timeLogs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    AichatModule,
    TimeLogsModule,
  ],
  controllers: [AppController, TimeLogsController],
  providers: [AppService, TimeLogsService],
})
export class AppModule {}
