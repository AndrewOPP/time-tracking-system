import { UserWorkFormat } from '@time-tracking-app/database/index';
import { calculateEmployedTimeData } from 'src/timeLogs/utils/employedTimeCalculator';
import { getWeeksForMonth } from 'src/timeLogs/utils/monthToWeeks';
import { PROJECT_TYPE, TIMELOGS_QUERIES_CONFIG } from 'src/timeLogs/constants/timeLogs.constants';
import { AI_CHAT_THRESHOLDS, AI_CHAT_FALLBACKS } from '../constants/aichat.constants';
// eslint-disable-next-line
export const mapUserStats = (user: any) => {
  const totalUserHours = user.timeLogs.reduce(
    // eslint-disable-next-line
    (sum: number, log: any) => sum + Number(log.hours),
    0
  );
  // eslint-disable-next-line
  const ptoHours = user.ptoLogs.reduce((sum: number, log: any) => sum + Number(log.hours), 0);
  // eslint-disable-next-line
  const projectsData = user.projects.map((up: any) => {
    // eslint-disable-next-line
    const projectLogs = user.timeLogs.filter((log: any) => log.projectId === up.projectId);
    const perProjectTotal = projectLogs.reduce(
      // eslint-disable-next-line
      (sum: number, log: any) => sum + Number(log.hours),
      0
    );

    return {
      id: up.project.id,
      name: up.project.name,
      pm:
        up.project.projectManager?.realName ||
        up.project.projectManager?.username ||
        AI_CHAT_FALLBACKS.UNASSIGNED_PM,
      type:
        up.project.type === PROJECT_TYPE.billable
          ? PROJECT_TYPE.billable
          : PROJECT_TYPE.nonBillable,
      perProjectTotal,
    };
  });

  const currentDate = new Date();
  const hoursPerDay =
    user.workFormat === UserWorkFormat.PART_TIME
      ? AI_CHAT_THRESHOLDS.PART_TIME_HOURS
      : AI_CHAT_THRESHOLDS.FULL_TIME_HOURS;

  let weeksInfo = getWeeksForMonth(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    hoursPerDay
  );
  weeksInfo = weeksInfo.filter(
    week => week.weekNumber <= TIMELOGS_QUERIES_CONFIG.weekNumberRange || week.workingHours > 0
  );

  const stats = calculateEmployedTimeData({
    totalUserHours: totalUserHours + ptoHours,
    weeksInfo: weeksInfo,
    projects: projectsData,
  });

  return {
    id: user.id,
    name: user.realName || user.username || user.email,
    skills:
      user.technologies.length > 0
        ? // eslint-disable-next-line
          user.technologies.map((t: any) => t.technology.name)
        : [AI_CHAT_FALLBACKS.NO_SKILLS],
    workFormat: user.workFormat,
    // eslint-disable-next-line
    activeProjects: projectsData.map((p: any) => ({
      name: p.name,
      pm: p.pm,
      hoursSpent: p.perProjectTotal,
    })),
    stats,
    ptoHours,
    totalLoggedHours: totalUserHours,
  };
};
// eslint-disable-next-line
export const mapProjectStats = (project: any) => {
  // eslint-disable-next-line
  const teamMembers = project.users.map((up: any) => {
    // eslint-disable-next-line
    const userLogsOnProject = project.timeLogs.filter((log: any) => log.userId === up.userId);
    const perProjectTotal = userLogsOnProject.reduce(
      // eslint-disable-next-line
      (sum: number, log: any) => sum + Number(log.hours),
      0
    );

    return {
      name: up.user.realName || up.user.username,
      position: up.position,
      perProjectTotalHours: perProjectTotal,
    };
  });

  const totalProjectHours = project.timeLogs.reduce(
    // eslint-disable-next-line
    (sum: number, log: any) => sum + Number(log.hours),
    0
  );

  return {
    projectName: project.name,
    status: project.status,
    domain: project.domain,
    projectManager:
      project.projectManager?.realName ||
      project.projectManager?.username ||
      AI_CHAT_FALLBACKS.UNASSIGNED_PM,
    type: project.type,
    startDate: project.startDate,
    totalTeamMembers: teamMembers.length,
    totalProjectHoursThisMonth: totalProjectHours,
    teamMembers,
  };
};
