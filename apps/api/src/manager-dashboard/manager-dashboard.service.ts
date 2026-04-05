import { Injectable } from '@nestjs/common';
import { subDays, eachDayOfInterval, isWeekend } from 'date-fns';
import { PrismaService, UserRole, UserWorkFormat } from '@time-tracking-app/database/index';

@Injectable()
export class ManagerDashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverviewData() {
    const endDate = new Date();
    const startDate = subDays(endDate, 14); // Берем ровно 14 дней назад от текущей секунды

    // Считаем норму часов за эти 2 недели (исключая выходные)
    const hoursPerDay = 8;
    const daysInterval = eachDayOfInterval({ start: startDate, end: endDate });
    const workingDays = daysInterval.filter(day => !isWeekend(day)).length;
    const periodWorkingHours = workingDays * hoursPerDay || 1; // Защита от деления на ноль

    const users = await this.prisma.user.findMany({
      where: {
        isActive: true,
        systemRole: UserRole.EMPLOYEE,
      },
      select: {
        id: true,
        realName: true,
        username: true,
        workFormat: true,
        avatarUrl: true,
        timeLogs: {
          // Ищем логи за последние 14 дней
          where: { date: { gte: startDate, lte: endDate } },
          select: { hours: true, projectId: true },
        },
        ptoLogs: {
          // Ищем отпуска за последние 14 дней
          where: { date: { gte: startDate, lte: endDate } },
          select: { hours: true },
        },
      },
    });

    const topProjectsRaw = await this.prisma.timeLog.groupBy({
      by: ['projectId'],
      where: { date: { gte: startDate, lte: endDate } },
      _sum: { hours: true },
      orderBy: { _sum: { hours: 'desc' } },
      take: 5,
    });

    const topProjects = await Promise.all(
      topProjectsRaw.map(async p => {
        const project = await this.prisma.project.findUnique({
          where: { id: p.projectId },
          select: { name: true },
        });

        const uniqueUsers = await this.prisma.timeLog.findMany({
          where: { projectId: p.projectId, date: { gte: startDate, lte: endDate } },
          select: { userId: true },
          distinct: ['userId'],
        });

        return {
          id: p.projectId,
          name: project?.name || 'Unknown Project',
          membersCount: uniqueUsers.length,
          totalHours: Number(p._sum.hours || 0),
        };
      })
    );

    let totalTrackedHours = 0;
    let totalPtoHours = 0;
    let availableCount = 0;
    let overloadedCount = 0;
    let partTimeCount = 0;
    const activeProjectIds = new Set<string>();

    const processedUsers = users.map(user => {
      const tracked = user.timeLogs.reduce((sum, log) => sum + Number(log.hours), 0);
      const pto = user.ptoLogs.reduce((sum, log) => sum + Number(log.hours), 0);

      totalTrackedHours += tracked;
      totalPtoHours += pto;

      const userProjects = new Set(user.timeLogs.map(log => log.projectId));
      userProjects.forEach(id => activeProjectIds.add(id));

      if (user.workFormat === UserWorkFormat.PART_TIME) partTimeCount++;

      const norm =
        user.workFormat === UserWorkFormat.PART_TIME
          ? periodWorkingHours * 0.5
          : periodWorkingHours;

      const totalHours = tracked + pto;
      const loadPercent = norm > 0 ? Math.round((totalHours / norm) * 100) : 0;

      if (loadPercent < 100) availableCount++;
      if (loadPercent > 100) overloadedCount++;

      return {
        id: user.id,
        name: user.realName || user.username,
        workFormat: user.workFormat as string,
        ptoHours: pto,
        username: user.username,
        avatarUrl: user.avatarUrl || '',
        loadPercent,
        activeProjectsCount: userProjects.size,
      };
    });

    const averageTeamLoad =
      processedUsers.length > 0
        ? Math.round(
            processedUsers.reduce((sum, u) => sum + u.loadPercent, 0) / processedUsers.length
          )
        : 0;

    const averagePtoHours =
      processedUsers.length > 0 ? Math.round((totalPtoHours / processedUsers.length) * 10) / 10 : 0;

    const mostAvailableEmployees = [...processedUsers]
      .sort((a, b) => a.loadPercent - b.loadPercent)
      .slice(0, 5);

    const highestLoadEmployees = [...processedUsers]
      .sort((a, b) => b.loadPercent - a.loadPercent)
      .slice(0, 5);

    return {
      kpis: {
        totalTrackedHours: Math.round(totalTrackedHours * 10) / 10,
        activeEmployeesCount: processedUsers.length,
        availableEmployeesCount: availableCount,
        overloadedEmployeesCount: overloadedCount,
        activeProjectsCount: activeProjectIds.size,
        averageTeamLoad,
        partTimeCount,
        averagePtoHours,
        capacityGap: Math.max(0, 100 - averageTeamLoad),
      },
      mostAvailableEmployees,
      highestLoadEmployees,
      topProjects,
    };
  }
}
