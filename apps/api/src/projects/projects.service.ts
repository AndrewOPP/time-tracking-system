import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@time-tracking-app/database/index';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProjects(id: string) {
    const currenntUserId = id;

    try {
      const projects = await this.prisma.project.findMany({
        where: {
          OR: [
            { users: { some: { userId: currenntUserId } } },
            { projectManagerId: currenntUserId },
          ],
        },
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          status: true,
          users: {
            take: 5,
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
      throw new InternalServerErrorException('Failed to load project list');
    }
  }

  async getUserProjectById(userId: string, projectIdToFind: string) {
    const projectId = projectIdToFind;
    const currentUserId = userId;
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
        include: {
          projectManager: {
            select: {
              id: true,
              realName: true,
              username: true,
            },
          },
          technologies: {
            select: {
              name: true,
              type: true,
            },
          },
          users: {
            include: {
              user: { select: { id: true, realName: true, username: true } },
            },
          },
        },
      });

      if (!project) {
        throw new NotFoundException(`Project with id ${projectId} was not found.`);
      }

      const isParticipant = project.users.some(user => user.userId === currentUserId);
      const isPM = project.projectManagerId === currentUserId;

      if (!isParticipant && !isPM) {
        throw new ForbiddenException('You do not have access to this project');
      }

      const projectDetails = {
        id: project.id,
        name: project.name,
        logo: project.avatarUrl || project.emoji,
        status: project.status,
        startDate: project.startDate,
        domain: project.technologies.map(t => t.name).join(', '),
        pm: project.projectManager
          ? {
              name: project.projectManager.realName || project.projectManager.username,
            }
          : null,
        team: project.users.map(u => ({
          id: u.user.id,
          name: u.user.realName || u.user.username,
          position: u.position,
        })),
      };

      return projectDetails;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }

      console.error(error);
      throw new InternalServerErrorException('Error during the project details fetching');
    }
  }
}
