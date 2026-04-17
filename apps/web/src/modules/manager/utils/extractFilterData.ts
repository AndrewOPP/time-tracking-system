import type { ManagerDashboardRow } from '../types/managerAIChat.types';

export const extractFilterData = (data: ManagerDashboardRow[]) => {
  const users: { employeeName: string; avatarUrl: string | null }[] = [];
  const projectsMap = new Map<
    string,
    { projectId: string; projectName: string; projectAvatarUrl: string }
  >();
  const pmsMap = new Map<string, { pmName: string; pmAvatarUrl: string }>();

  data.forEach(employee => {
    if (employee.employeeName) {
      users.push({
        employeeName: employee.employeeName,
        avatarUrl: employee.avatarUrl,
      });
    }

    if (Array.isArray(employee.projects)) {
      employee.projects.forEach(project => {
        if (project.projectId && !projectsMap.has(project.projectId)) {
          projectsMap.set(project.projectId, {
            projectId: project.projectId,
            projectName: project.projectName,
            projectAvatarUrl: project.projectAvatarUrl,
          });
        }

        if (project.pmName && !pmsMap.has(project.pmName)) {
          pmsMap.set(project.pmName, {
            pmName: project.pmName,
            pmAvatarUrl: project.pmAvatarUrl || '',
          });
        }
      });
    }
  });

  return {
    users,
    projects: Array.from(projectsMap.values()),
    pms: Array.from(pmsMap.values()),
  };
};
