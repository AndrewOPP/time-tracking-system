import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@time-tracking-app/database/index';
import { subDays } from 'date-fns'; // <-- Добавили импорт для работы с датами

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByUsername(requestedUsername: string) {
    const endDate = new Date();
    const startDate = subDays(endDate, 14);

    const user = await this.prisma.user.findUnique({
      where: { username: requestedUsername },
      include: {
        technologies: {
          include: {
            technology: true,
          },
          orderBy: { rating: 'desc' },
        },
        projects: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                status: true,
                type: true,
              },
            },
          },
          orderBy: { status: 'asc' },
        },
        timeLogs: {
          // Убрали take: 20 и добавили фильтр за 14 дней
          where: { date: { gte: startDate, lte: endDate } },
          orderBy: { date: 'desc' },
          include: {
            project: {
              select: { name: true },
            },
          },
        },
        ptoLogs: {
          // Убрали take: 10 и добавили фильтр за 14 дней
          where: { date: { gte: startDate, lte: endDate } },
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ${requestedUsername} username is not found`);
    }

    const profileResponse = {
      email: user.email,
      username: user.username,
      fullName: user.realName || user.username,
      avatarUrl: user.avatarUrl,
      systemRole: user.systemRole,
      status: user.status,
      workFormat: user.workFormat,
      createdAt: user.createdAt,

      technologies: user.technologies.map(t => ({
        id: t.technology.id,
        name: t.technology.name,
        type: t.technology.type,
        image: t.technology.image,
        rating: t.rating,
      })),

      projects: user.projects.map(p => ({
        id: p.project.id,
        name: p.project.name,
        avatarUrl: p.project.avatarUrl,
        projectStatus: p.project.status,
        projectType: p.project.type,
        userPosition: p.position,
        userProjectStatus: p.status,
      })),

      recentTimeLogs: user.timeLogs.map(log => ({
        id: log.id,
        date: log.date,
        hours: Number(log.hours),
        description: log.description,
        projectName: log.project.name,
      })),

      recentPtoLogs: user.ptoLogs.map(pto => ({
        id: pto.id,
        date: pto.date,
        hours: Number(pto.hours),
      })),
    };

    return profileResponse;
  }
}
