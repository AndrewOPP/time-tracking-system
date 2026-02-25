import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AuthModule } from 'src/auth/auth.module';
import { ProjectsController } from './projects.controller';

@Module({
  imports: [AuthModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
