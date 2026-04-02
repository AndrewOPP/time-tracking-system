import { PROJECT_TYPE, TIMELOGS_QUERIES_CONFIG } from '../timeLogs/constants/timeLogs.constants';
import { ProjectData } from '../timeLogs/types/timeLogs.types';
import { calculateEmployedTimeData } from '../timeLogs/utils/employedTimeCalculator';
import { getWeeksForMonth } from '../timeLogs/utils/monthToWeeks';
import { AI_MESSAGES } from './constants/aichat.constants';
import { RawProject, RawUser } from './types/aichat.types';
import { capitalize } from './utils/string';

export function mapUsersToAiResponse(users: RawUser[], currentYear: number, currentMonth: number) {
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

    let weeksInfo = getWeeksForMonth(currentYear, currentMonth + 1, hoursPerDay);

    weeksInfo = weeksInfo.filter(
      week => week.weekNumber <= TIMELOGS_QUERIES_CONFIG.weekNumberRange || week.workingHours > 0
    );

    const stats = calculateEmployedTimeData({
      totalUserHours: totalUserHours + ptoHours,
      weeksInfo: weeksInfo,
      projects: projectsData,
      workFormat: user.workFormat,
    });

    const aiStats = {
      totalUserHours: stats.totalUserHours,
      billableHours: stats.hours.billable,
      overtime: stats.hours.overtime,
      untracked: stats.hours.untracked,
      nonBillable: stats.hours.nonBillable,
      billableHoursPercent: stats.aiChatVisualPercents.billable,
      untrackedHoursPercent: stats.aiChatVisualPercents.untracked,
      nonBillableHoursPercent: stats.aiChatVisualPercents.nonBillable,
      employedTimePercent: stats.employedTimePercent,
      monthWorkingHours: stats.monthWorkingHours,
    };

    return {
      id: user.id,
      name: user.realName || user.username || user.email,
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
