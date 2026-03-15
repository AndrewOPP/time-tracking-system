import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaService } from '@time-tracking-app/database/index';
import { user } from '../types/timeLogs.types';
import { TIME_LOG_ERRORS } from '../constants/timeLogs.constants';
import { getWeeksForMonth } from '../utils/monthToWeeks';
import { format } from 'date-fns';

@Injectable()
export class TimeLogQueriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findLogsByPeriod(user: user, from: string, to: string, projectId?: string) {
    const userId = user.sub;

    const where: Prisma.TimeLogWhereInput = {
      userId: userId,
      date: {
        gte: new Date(from),
        lte: new Date(to),
      },
    };

    if (projectId) {
      where.projectId = projectId;
    }

    return this.prisma.timeLog.findMany({
      where: where,
      orderBy: { date: 'asc' },
      include: {
        project: {
          select: { name: true },
        },
      },
    });
  }

  async findMissingDays(userId: string, from: string, to: string) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) throw new NotFoundException(TIME_LOG_ERRORS.USER.NOT_FOUND);

    const fromDate = new Date(from);
    const toDate = new Date(to);

    const existingLogs = await this.prisma.timeLog.findMany({
      where: { userId, date: { gte: fromDate, lte: toDate } },
      select: { date: true },
    });

    const trackedDates = new Set(existingLogs.map(log => log.date.toISOString().split('T')[0]));
    const missingDays: string[] = [];
    const currentDate = new Date(fromDate);

    while (currentDate <= toDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const dateString = currentDate.toISOString().split('T')[0];
        if (!trackedDates.has(dateString)) missingDays.push(dateString);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return { userId, period: { from, to }, missingDays };
  }

  // async getManagerDashboard(from: string, to: string, search?: string) {
  //   const fromDate = new Date(from);
  //   const toDate = new Date(to);

  //   const whereClause: Prisma.TimeLogWhereInput = {
  //     date: { gte: fromDate, lte: toDate },
  //   };

  //   if (search) {
  //     whereClause.OR = [
  //       { user: { realName: { contains: search, mode: 'insensitive' } } },
  //       { project: { name: { contains: search, mode: 'insensitive' } } },
  //       { project: { projectManager: { realName: { contains: search, mode: 'insensitive' } } } },
  //     ];
  //   }

  //   return this.prisma.timeLog.findMany({
  //     where: whereClause,
  //     orderBy: { date: 'desc' },
  //     include: {
  //       user: { select: { id: true, realName: true, email: true, avatarUrl: true } },
  //       project: {
  //         select: {
  //           id: true,
  //           name: true,
  //           emoji: true,
  //           projectManager: { select: { id: true, realName: true, avatarUrl: true } },
  //         },
  //       },
  //     },
  //   });
  // }

  // async getManagerDashboard(from: string, to: string, search?: string) {
  //   const fromDate = new Date(from);
  //   const toDate = new Date(to);

  //   const year = fromDate.getFullYear();
  //   const month = fromDate.getMonth() + 1;
  //   let weeksInfo = getWeeksForMonth(year, month);

  //   weeksInfo = weeksInfo.filter(week => {
  //     if (week.weekNumber <= 5) return true;
  //     return week.workingHours > 0;
  //   });

  //   const formattedWeeks = weeksInfo.map(week => ({
  //     ...week,
  //     startStr: format(week.startDate, 'yyyy-MM-dd'),
  //     endStr: format(week.endDate, 'yyyy-MM-dd'),
  //   }));

  //   const monthWorkingHours = weeksInfo.reduce((sum, week) => sum + week.workingHours, 0);

  //   const userWhere: Prisma.UserWhereInput = {};

  //   if (search) {
  //     userWhere.OR = [
  //       { realName: { contains: search, mode: 'insensitive' } },
  //       { email: { contains: search, mode: 'insensitive' } },
  //     ];
  //   }

  //   const users = await this.prisma.user.findMany({
  //     where: userWhere,
  //     select: {
  //       id: true,
  //       realName: true,
  //       email: true,
  //       avatarUrl: true,
  //       workFormat: true,
  //       projects: {
  //         include: {
  //           project: {
  //             select: {
  //               id: true,
  //               name: true,
  //               avatarUrl: true,
  //               projectManager: {
  //                 select: {
  //                   realName: true,
  //                   avatarUrl: true,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       timeLogs: {
  //         where: { date: { gte: fromDate, lte: toDate } },
  //         select: { projectId: true, date: true, hours: true },
  //       },
  //       ptoLogs: {
  //         where: { date: { gte: fromDate, lte: toDate } },
  //         select: { hours: true },
  //       },
  //     },
  //     orderBy: { realName: 'asc' },
  //   });

  //   const tableData: ManagerDashboardRow[] = [];

  //   for (const user of users) {
  //     if (!user.projects.length) continue;

  //     const totalPto = user.ptoLogs.reduce((s, l) => s + Number(l.hours), 0);
  //     const totalUserHours = user.timeLogs.reduce((s, l) => s + Number(l.hours), 0);

  //     const employedTimePercent =
  //       monthWorkingHours > 0 ? Math.round((totalUserHours / monthWorkingHours) * 100) : 0;

  //     const logsByProject = new Map<string, typeof user.timeLogs>();

  //     for (const log of user.timeLogs) {
  //       if (!logsByProject.has(log.projectId)) {
  //         logsByProject.set(log.projectId, []);
  //       }
  //       logsByProject.get(log.projectId)!.push(log);
  //     }

  //     for (let i = 0; i < user.projects.length; i++) {
  //       const userProject = user.projects[i];
  //       const projectId = userProject.project.id;

  //       const projectLogs = logsByProject.get(projectId) ?? [];

  //       const weeklyHours = [0, 0, 0, 0, 0, 0];

  //       for (const log of projectLogs) {
  //         const logDateStr = format(log.date, 'yyyy-MM-dd');

  //         const targetWeek = formattedWeeks.find(
  //           week => logDateStr >= week.startStr && logDateStr <= week.endStr
  //         );

  //         if (targetWeek) {
  //           weeklyHours[targetWeek.weekNumber - 1] += Number(log.hours);
  //         }
  //       }

  //       const perProjectTotal = projectLogs.reduce((sum, log) => sum + Number(log.hours), 0);

  //       tableData.push({
  //         userId: user.id,
  //         employeeName: user.realName || user.email,
  //         avatarUrl: user.avatarUrl,
  //         isFirstRowForUser: i === 0,
  //         userTotalProjects: user.projects.length,
  //         totalUserHours,
  //         ptoHours: totalPto,
  //         format: user.workFormat,
  //         employedTimePercent,

  //         projectId,
  //         projectName: userProject.project.name,
  //         pmName: userProject.project.projectManager?.realName ?? 'No PM',
  //         pmAvatarUrl: userProject.project.projectManager?.avatarUrl ?? null,
  //         projectAvatarUrl: userProject.project.avatarUrl ?? '',
  //         perProjectTotal,

  //         week1: weeklyHours[0],
  //         week2: weeklyHours[1],
  //         week3: weeklyHours[2],
  //         week4: weeklyHours[3],
  //         week5: weeklyHours[4],
  //         week6: weeklyHours[5],
  //       });
  //     }
  //   }

  //   return {
  //     weeksInfo,
  //     tableData,
  //   };
  // }

  async getManagerDashboard(from: string, to: string, search?: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const year = fromDate.getFullYear();
    const month = fromDate.getMonth() + 1;

    // Отримуємо інформацію про тижні
    let weeksInfo = getWeeksForMonth(year, month);
    weeksInfo = weeksInfo.filter(week => week.weekNumber <= 5 || week.workingHours > 0);

    const formattedWeeks = weeksInfo.map(week => ({
      ...week,
      startStr: format(week.startDate, 'yyyy-MM-dd'),
      endStr: format(week.endDate, 'yyyy-MM-dd'),
    }));

    const monthWorkingHours = weeksInfo.reduce((sum, week) => sum + week.workingHours, 0);

    const userWhere: Prisma.UserWhereInput = {};
    if (search) {
      userWhere.OR = [
        { realName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Запит до БД залишаємо ефективним
    const users = await this.prisma.user.findMany({
      where: userWhere,
      select: {
        id: true,
        realName: true,
        email: true,
        avatarUrl: true,
        workFormat: true,
        projects: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                projectManager: {
                  select: { realName: true, avatarUrl: true },
                },
              },
            },
          },
        },
        timeLogs: {
          where: { date: { gte: fromDate, lte: toDate } },
          select: { projectId: true, date: true, hours: true },
        },
        ptoLogs: {
          where: { date: { gte: fromDate, lte: toDate } },
          select: { hours: true },
        },
      },
      orderBy: { realName: 'asc' },
    });

    // Формуємо ієрархічні дані (1 юзер = 1 рядок)
    const tableData = users
      .filter(user => user.projects.length > 0)
      .map(user => {
        const totalPto = user.ptoLogs.reduce((s, l) => s + Number(l.hours), 0);
        const totalUserHours = user.timeLogs.reduce((s, l) => s + Number(l.hours), 0);
        const employedTimePercent =
          monthWorkingHours > 0 ? Math.round((totalUserHours / monthWorkingHours) * 100) : 0;

        // Групуємо логи по проектах для швидкого доступу
        const logsByProject = new Map<string, typeof user.timeLogs>();
        for (const log of user.timeLogs) {
          if (!logsByProject.has(log.projectId)) logsByProject.set(log.projectId, []);
          logsByProject.get(log.projectId)!.push(log);
        }

        // Перетворюємо проекти в масив всередині юзера
        const projects = user.projects.map(userProject => {
          const projectId = userProject.project.id;
          const projectLogs = logsByProject.get(projectId) ?? [];

          // Розрахунок годин по тижнях (масив з 6 елементів)
          const weeklyHours = [0, 0, 0, 0, 0, 0];
          for (const log of projectLogs) {
            const logDateStr = format(log.date, 'yyyy-MM-dd');
            const targetWeek = formattedWeeks.find(
              w => logDateStr >= w.startStr && logDateStr <= w.endStr
            );
            if (targetWeek) {
              weeklyHours[targetWeek.weekNumber - 1] += Number(log.hours);
            }
          }

          return {
            projectId,
            projectName: userProject.project.name,
            projectAvatarUrl: userProject.project.avatarUrl ?? '',
            pmName: userProject.project.projectManager?.realName ?? 'No PM',
            pmAvatarUrl: userProject.project.projectManager?.avatarUrl ?? null,
            perProjectTotal: projectLogs.reduce((sum, log) => sum + Number(log.hours), 0),
            // Віддаємо тижні об'єктом для зручного accessorKey на фронті
            weeks: {
              week1: weeklyHours[0],
              week2: weeklyHours[1],
              week3: weeklyHours[2],
              week4: weeklyHours[3],
              week5: weeklyHours[4],
              week6: weeklyHours[5],
            },
          };
        });

        return {
          userId: user.id,
          employeeName: user.realName || user.email,
          avatarUrl: user.avatarUrl,
          totalUserHours,
          ptoHours: totalPto,
          format: user.workFormat,
          employedTimePercent,
          projects, // Твій масив проектів
        };
      });

    return {
      weeksInfo,
      tableData,
    };
  }
}
