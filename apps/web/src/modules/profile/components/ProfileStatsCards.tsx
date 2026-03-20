import React from 'react';
import type { EmployeeProfileResponse } from '../types/employee.types';
import type { UserTheme } from '../utils/getUserTheme';

interface ProfileStatsCardsProps {
  user: EmployeeProfileResponse;
  theme: UserTheme;
}

export const ProfileStatsCards: React.FC<ProfileStatsCardsProps> = ({ user, theme }) => {
  const totalLoggedHours = user.recentTimeLogs.reduce((sum, log) => sum + log.hours, 0);

  const normHours = user.workFormat === 'FULL_TIME' ? 40 : 20;
  const hoursPercent = Math.min(Math.round((totalLoggedHours / normHours) * 100), 100);

  const activeProjects = user.projects.filter(p => p.userProjectStatus === 'ACTIVE');

  // Максимально чисто и просто: только мягкая тень при наведении, без сдвигов
  const cardClasses =
    'bg-white rounded-2xl p-6 flex flex-col gap-4 border border-gray-100 shadow-sm transition-shadow duration-200 hover:shadow-md';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4">
      {/* Technology Stack */}
      <div className={cardClasses}>
        <h3 className="text-gray-900 font-semibold">Technology Stack</h3>
        <div className="flex flex-wrap gap-3">
          {user.technologies.length > 0 ? (
            user.technologies.map(tech => (
              <div
                key={tech.id}
                className="flex items-center justify-center bg-gray-50 rounded-xl p-2 border border-gray-100"
                title={`${tech.name} (${tech.rating}/5)`}
              >
                {tech.image ? (
                  <img src={tech.image} alt={tech.name} className="w-8 h-8 object-contain" />
                ) : (
                  <span className="text-sm font-bold text-indigo-600 px-2 py-1">{tech.name}</span>
                )}
              </div>
            ))
          ) : (
            <span className="text-gray-400 text-sm">No technologies added</span>
          )}
        </div>
      </div>

      {/* Current Projects */}
      <div className={cardClasses}>
        <h3 className="text-gray-900 font-semibold">Current Projects</h3>
        <div className="grid grid-cols-2 gap-3">
          {activeProjects.length > 0 ? (
            activeProjects.map(project => (
              <div key={project.id} className="flex items-center gap-3 overflow-hidden">
                <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm flex-shrink-0">
                  ✓
                </div>
                <span className="text-sm text-gray-700 font-medium truncate" title={project.name}>
                  {project.name}
                </span>
              </div>
            ))
          ) : (
            <span className="text-gray-400 text-sm col-span-2">No active projects</span>
          )}
        </div>
      </div>

      {/* Logged Hours Summary */}
      <div className={cardClasses}>
        <h3 className="text-gray-900 font-semibold">Logged Hours Summary</h3>

        <div className="flex justify-between items-end mt-2">
          <div className="text-3xl font-bold text-gray-900">
            {totalLoggedHours}{' '}
            <span className="text-sm font-medium text-gray-400">/ {normHours}h</span>
          </div>
          <div className="text-sm font-semibold text-gray-500 mb-1">{hoursPercent}%</div>
        </div>

        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mt-1">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${theme.progress}`}
            style={{ width: `${hoursPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
