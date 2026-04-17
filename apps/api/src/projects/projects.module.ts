import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { AuthModule } from '../auth/auth.module';
import { ProjectsService } from './projects.service';

@Module({
  imports: [AuthModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
