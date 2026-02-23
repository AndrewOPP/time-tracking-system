import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

interface JwtPayload {
  sub: string;
  email: string;
}

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('')
  async getUserProjects(@Req() req: RequestWithUser) {
    const userId = req.user.sub;

    const projects = await this.projectsService.getUserProjects(userId);

    return projects;
  }

  @Get(':id')
  async getUserProjectById(@Req() req: RequestWithUser, @Param('id') projectId: string) {
    const userId = req.user.sub;

    const project = await this.projectsService.getUserProjectById(userId, projectId);

    return project;
  }
}
