import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@time-tracking-app/database/index';
import { ProjectError } from './types/projects.types';
import { Role } from '../auth/types/oauth.types';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProjects(id: string) {
    const userId = id;

    try {
      const projects = await this.prisma.project.findMany({
        where: {
          OR: [{ users: { some: { userId: userId } } }, { projectManagerId: userId }],
        },
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          status: true,
          users: {
            select: {
              user: {
                select: { id: true, avatarUrl: true },
              },
            },
          },
          _count: {
            select: { users: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      const formattedProjects = projects.map(project => ({
        id: project.id,
        name: project.name,
        logo: project.avatarUrl,
        status: project.status,
        teamAvatars: project.users.map(u => u.user.avatarUrl),
        totalTeamMembers: project._count.users,
        totalLoggedHours: 0,
      }));

      return formattedProjects;
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException(ProjectError.LIST_FETCH_FAILED);
    }
  }

  async getUserProjectById(userId: string, userRole: string, projectId: string) {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
        include: {
          projectManager: {
            select: {
              id: true,
              realName: true,
              username: true,
              avatarUrl: true,
            },
          },
          technologies: {
            select: { name: true, type: true },
          },
          users: {
            include: {
              user: { select: { id: true, realName: true, username: true, avatarUrl: true } },
            },
          },
        },
      });

      if (!project) {
        throw new NotFoundException(`${ProjectError.NOT_FOUND}:${projectId}`);
      }

      const isParticipant = project.users.some(user => user.userId === userId);
      const isPM = project.projectManagerId === userId || userRole === Role.MANAGER;

      if (!isParticipant && !isPM) {
        throw new ForbiddenException(ProjectError.ACCESS_DENIED);
      }

      const projectDetails = {
        id: project.id,
        name: project.name,
        logo: project.avatarUrl || project.emoji,
        status: project.status,
        description: project.description,
        startDate: project.startDate,
        domain: project.domain,
        pm: project.projectManager
          ? {
              name: project.projectManager.realName || project.projectManager.username,
              avatarUrl: project.projectManager.avatarUrl || null,
            }
          : null,
        team: project.users.map(u => ({
          id: u.user.id,
          name: u.user.realName || u.user.username,
          position: u.position,
          avatarUrl: u.user.avatarUrl || null,
        })),
      };

      return projectDetails;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }

      console.error(error);
      throw new InternalServerErrorException(ProjectError.DETAILS_FETCH_FAILED);
    }
  }
}
