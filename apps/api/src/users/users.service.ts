import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService, UserWorkFormat } from '@time-tracking-app/database/index';
import { subDays, eachDayOfInterval, isWeekend } from 'date-fns';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByUsername(requestedUsername: string) {
    const endDate = new Date();
    const startDate = subDays(endDate, 14);

    const daysInterval = eachDayOfInterval({ start: startDate, end: endDate });
    const workingDaysCount = daysInterval.filter(day => !isWeekend(day)).length;
    const standardHoursPerDay = 8;
    const periodWorkingHours = workingDaysCount * standardHoursPerDay;

    const user = await this.prisma.user.findUnique({
      where: { username: requestedUsername },
      include: {
        technologies: {
          include: { technology: true },
          orderBy: { rating: 'desc' },
        },
        projects: {
          include: { project: true },
          orderBy: { status: 'asc' },
        },
        timeLogs: {
          where: { date: { gte: startDate, lte: endDate } },
          include: { project: { select: { name: true } } },
        },
        ptoLogs: {
          where: { date: { gte: startDate, lte: endDate } },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ${requestedUsername} username is not found`);
    }

    const totalTracked = user.timeLogs.reduce((sum, log) => sum + Number(log.hours), 0);
    const totalPto = user.ptoLogs.reduce((sum, log) => sum + Number(log.hours), 0);
    const totalHours = totalTracked + totalPto;

    const normHours =
      user.workFormat === UserWorkFormat.PART_TIME ? periodWorkingHours * 0.5 : periodWorkingHours;

    const loadPercent = normHours > 0 ? Math.round((totalHours / normHours) * 100) : 0;

    return {
      email: user.email,
      username: user.username,
      fullName: user.realName || user.username,
      avatarUrl: user.avatarUrl,
      systemRole: user.systemRole,
      status: user.status,
      workFormat: user.workFormat,
      createdAt: user.createdAt,

      stats: {
        totalHours: Math.round(totalHours * 10) / 10,
        normHours: Math.round(normHours * 10) / 10,
        loadPercent,
      },

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
    };
  }
}
