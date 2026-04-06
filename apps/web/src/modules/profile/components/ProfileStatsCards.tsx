import React from 'react';
import { Link } from 'react-router-dom';
import type { EmployeeProfileResponse } from '../types/employee.types';
import type { UserTheme } from '../utils/getUserTheme';
import { statusConfig } from '@/shared/config/projectStatusConfig';
import { ROUTES } from '@/shared/constants/routes';
import { buildPath } from '@/shared/utils/buildPath';

interface ProfileStatsCardsProps {
  user: EmployeeProfileResponse;
  theme: UserTheme;
}

export const ProfileStatsCards: React.FC<ProfileStatsCardsProps> = ({ user, theme }) => {
  const totalLoggedHours = user.recentTimeLogs.reduce((sum, log) => sum + log.hours, 0);
  const normHours = user.workFormat === 'FULL_TIME' ? 8 * 10 : 4 * 10;

  const hoursPercent = Math.round((totalLoggedHours / normHours) * 100);

  const activeProjects = user.projects.filter(p => p.userProjectStatus === 'ACTIVE');

  const cardClasses = 'bg-white rounded-2xl p-6 flex flex-col gap-4 border border-gray-200 w-full';

  return (
    <div className="flex flex-col gap-6  w-full">
      <div className={cardClasses}>
        <h3 className="text-gray-900 font-semibold text-sm">Technology Stack</h3>
        <div className="flex flex-wrap gap-2">
          {user.technologies.length > 0 ? (
            user.technologies.map(tech => (
              <div
                key={tech.id}
                className="flex items-center justify-center bg-gray-50 rounded-lg p-2 border border-gray-200"
                title={`${tech.name} (${tech.rating}/10)`}
              >
                {tech.image ? (
                  <img src={tech.image} alt={tech.name} className="w-6 h-6 object-contain" />
                ) : (
                  <span className="text-xs font-bold text-indigo-600 px-1">{tech.name}</span>
                )}
              </div>
            ))
          ) : (
            <span className="text-gray-400 text-sm">No technologies added</span>
          )}
        </div>
      </div>

      <div className={`${cardClasses}`}>
        <h3 className="text-gray-900 font-semibold text-sm">Current Projects</h3>
        <div className="flex flex-col gap-1.5">
          {activeProjects.length > 0 ? (
            activeProjects.map(project => {
              const config = statusConfig[project.projectStatus] || statusConfig.NOT_STARTED;

              return (
                <Link
                  key={project.id}
                  to={buildPath(ROUTES.DASHBOARD, project.id)}
                  className="flex items-center justify-between gap-3 overflow-hidden group cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded-lg transition-all duration-200"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {project.avatarUrl ? (
                      <img
                        src={project.avatarUrl}
                        alt={project.name}
                        className="w-6 h-6 rounded-md object-cover flex-shrink-0 border border-gray-100"
                      />
                    ) : (
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${theme.bg} ${theme.text}`}
                      >
                        {project.name.charAt(0)}
                      </div>
                    )}
                    <span
                      className="text-sm text-gray-700 font-medium truncate group-hover:text-gray-900 transition-colors"
                      title={project.name}
                    >
                      {project.name}
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[12px] font-medium flex-shrink-0 text-gray-700 ${config.bg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
                    {config.label}
                  </div>
                </Link>
              );
            })
          ) : (
            <span className="text-gray-400 text-sm">No active projects</span>
          )}
        </div>
      </div>

      <div className={cardClasses}>
        <h3 className="text-gray-900 font-semibold text-sm">Logged Hours Summary</h3>
        <div className="flex justify-between items-end mt-1">
          <div className="text-2xl font-bold text-gray-900">
            {totalLoggedHours.toFixed(1)}{' '}
            <span className="text-xs font-medium text-gray-400">/ {normHours.toFixed(1)}h</span>
          </div>
          {/* Текст теперь может показывать хоть 150% */}
          <div
            className={`text-sm font-semibold mb-1 ${hoursPercent > 100 ? 'text-red-500' : 'text-gray-500'}`}
          >
            {hoursPercent}%
          </div>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-1">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              hoursPercent > 100 ? 'bg-red-500' : theme.progress
            }`}
            /* А ширина полоски не может превысить 100%, чтобы не сломать CSS */
            style={{ width: `${Math.min(hoursPercent, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
