import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectsService } from './projects.service';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
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
    const userRole = req.user.role;

    const project = await this.projectsService.getUserProjectById(userId, userRole, projectId);

    return project;
  }
}
