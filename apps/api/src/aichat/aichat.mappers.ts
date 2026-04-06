import { eachDayOfInterval, isWeekend } from 'date-fns';
import { PROJECT_TYPE, TIMELOGS_QUERIES_CONFIG } from '../timeLogs/constants/timeLogs.constants';
import { ProjectData } from '../timeLogs/types/timeLogs.types';
import { calculateEmployedTimeData } from '../timeLogs/utils/employedTimeCalculator';
import { getWeeksForMonth } from '../timeLogs/utils/monthToWeeks';
import { AI_MESSAGES } from './constants/aichat.constants';
import { RawProject, RawUser } from './types/aichat.types';
import { capitalize } from './utils/string';

export function mapUsersToAiResponse(
  users: RawUser[],
  currentYear: number,
  currentMonth: number,
  customStartDate?: Date,
  customEndDate?: Date
) {
  return users.map(user => {
    const totalUserHours = user.timeLogs.reduce((sum, log) => sum + Number(log.hours), 0);
    const ptoHours = user.ptoLogs.reduce((sum, log) => sum + Number(log.hours), 0);

    const projectsData: ProjectData[] = user.projects.map(up => {
      const projectLogs = user.timeLogs.filter(log => log.projectId === up.projectId);
      const perProjectTotal = projectLogs.reduce((sum, log) => sum + Number(log.hours), 0);

      return {
        projectId: up.project.id,
        projectName: up.project.name,
        pmName:
          up.project.projectManager?.realName ||
          up.project.projectManager?.username ||
          AI_MESSAGES.UNASSIGNED_PM,
        pmAvatarUrl: up.project.projectManager?.avatarUrl || null,
        projectAvatarUrl: up.project.avatarUrl ?? '',
        type:
          up.project.type === PROJECT_TYPE.billable
            ? PROJECT_TYPE.billable
            : PROJECT_TYPE.nonBillable,
        perProjectTotal,
        weeks: {
          week1: 0,
          week2: 0,
          week3: 0,
          week4: 0,
          week5: 0,
          week6: 0,
        },
      };
    });

    const hoursPerDay = 8;

    let weeksInfo;

    if (customStartDate && customEndDate) {
      const daysInterval = eachDayOfInterval({ start: customStartDate, end: customEndDate });
      const workingDays = daysInterval.filter(day => !isWeekend(day)).length;

      weeksInfo = [
        {
          weekNumber: 1,
          startDate: customStartDate,
          endDate: customEndDate,
          workingHours: workingDays * hoursPerDay,
        },
      ];
    } else {
      weeksInfo = getWeeksForMonth(currentYear, currentMonth + 1, hoursPerDay);
      weeksInfo = weeksInfo.filter(
        week => week.weekNumber <= TIMELOGS_QUERIES_CONFIG.weekNumberRange || week.workingHours > 0
      );
    }

    // weeksInfo = weeksInfo.filter(
    //   week => week.weekNumber <= TIMELOGS_QUERIES_CONFIG.weekNumberRange || week.workingHours > 0
    // );

    const stats = calculateEmployedTimeData({
      totalUserHours: totalUserHours + ptoHours,
      weeksInfo: weeksInfo,
      projects: projectsData,
      workFormat: user.workFormat,
    });

    const safeBaseline = stats.monthWorkingHours || 1;

    const finalEmployedPercent = Math.round(stats.employedTimePercent);

    const aiStats = {
      totalUserHours: stats.totalUserHours,
      billableHours: stats.hours.billable,
      overtime: stats.hours.overtime,
      untracked: stats.hours.untracked,
      nonBillable: stats.hours.nonBillable,

      employedTimePercent: finalEmployedPercent,

      overtimePercent: Math.max(0, finalEmployedPercent - 100),
      overtimeHoursPercent: Math.max(0, finalEmployedPercent - 100),

      billableHoursPercent: Math.round((stats.hours.billable / safeBaseline) * 100),
      untrackedHoursPercent: Math.round((stats.hours.untracked / safeBaseline) * 100),
      nonBillableHoursPercent: Math.round((stats.hours.nonBillable / safeBaseline) * 100),

      monthWorkingHours: stats.monthWorkingHours,
    };

    console.log(aiStats.untrackedHoursPercent);
    console.log(user.realName, ' user.realName');
    console.log(aiStats.untracked > 0, '    aiStats.untracked');
    console.log(aiStats.untrackedHoursPercent > 0, '    aiStats.untracked');

    const warnings: string[] = [];

    if (finalEmployedPercent >= 100 || stats.hours.overtime > 0) {
      warnings.push(
        `Overloaded — ${finalEmployedPercent}% with ${stats.hours.overtime}h overtime. Consider rebalancing workload.`
      );
    } else if (finalEmployedPercent >= 90) {
      warnings.push(`At ${finalEmployedPercent}% — nearly at full capacity.`);
    }

    if (aiStats.untracked > 0) {
      warnings.push(
        `Note: ${aiStats.untrackedHoursPercent}% of time is untracked (${aiStats.untracked}h). Actual workload may be higher.`
      );
    }

    return {
      id: user.id,
      name: user.realName || user.username || user.email,
      warnings,
      skills:
        user.technologies.length > 0
          ? user.technologies.map(t => t.technology.name)
          : [AI_MESSAGES.NO_SKILLS],
      workFormat: user.workFormat
        ? user.workFormat
            .toLowerCase()
            .replace('_', '-')
            .replace(/^\w/, c => c.toUpperCase())
        : 'Unknown',
      activeProjects: projectsData.map(p => ({
        name: p.projectName,
        pm: p.pmName,
        hoursSpent: Number(p.perProjectTotal.toFixed(1)),
      })),
      aiStats,
      ptoHours,
      totalLoggedHours: Number(totalUserHours.toFixed(1)),
    };
  });
}

export function mapProjectsToAiResponse(projects: RawProject[]) {
  return projects.map(project => {
    const teamMembers = project.users.map(up => {
      const userLogsOnProject = project.timeLogs.filter(log => log.userId === up.userId);
      const perProjectTotal = userLogsOnProject.reduce((sum, log) => sum + Number(log.hours), 0);

      return {
        name: up.user.realName || up.user.username,
        position: up.position,
        perProjectTotalHours: Number(perProjectTotal.toFixed(1)),
      };
    });

    const totalProjectHours = project.timeLogs.reduce((sum, log) => sum + Number(log.hours), 0);

    return {
      projectName: project.name,
      status: capitalize(project.status),
      domain: capitalize(project.domain),
      technologies: project.technologies,
      projectManager:
        project.projectManager?.realName ||
        project.projectManager?.username ||
        AI_MESSAGES.UNASSIGNED_PM,
      type: project.type,
      startDate: project.startDate,
      totalTeamMembers: teamMembers.length,
      totalProjectHoursThisMonth: Number(totalProjectHours.toFixed(1)),
      teamMembers,
    };
  });
}
