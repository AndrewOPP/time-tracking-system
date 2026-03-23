import React from 'react';
import type { EmployeeProfileResponse } from '../types/employee.types';
import type { UserTheme } from '../utils/getUserTheme';

export const ProfileDetails: React.FC<{ user: EmployeeProfileResponse; theme: UserTheme }> = ({
  user,
  theme,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 w-full overflow-hidden flex flex-col">
      <div className="flex border-b border-gray-100 px-6 py-4 flex-shrink-0 bg-white z-20">
        <h3 className="text-gray-900 font-semibold text-sm">Recent Activity</h3>
      </div>

      <div className="h-[400px] overflow-y-auto relative  custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_#e5e7eb]">
            <tr className="text-[11px] uppercase text-gray-400 font-bold">
              <th className="py-4 pl-6 w-32">Date</th>
              <th className="py-4 w-48">Project</th>
              <th className="py-4 text-right">Hours</th>
              <th className="py-4 pl-6 pr-6">Task Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {user.recentTimeLogs.length > 0 ? (
              user.recentTimeLogs.map(log => (
                <tr key={log.id} className="group transition-colors hover:bg-gray-50/50">
                  <td className="py-3.5 pl-6 text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(log.date)}
                  </td>
                  <td className="py-3.5 text-sm font-medium text-gray-900">{log.projectName}</td>
                  <td className={`py-3.5 text-sm font-bold text-right ${theme.text}`}>
                    {log.hours.toFixed(1)}h
                  </td>
                  <td className="py-3.5 pr-6 pl-6 text-sm text-gray-600">{log.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-gray-400 italic">
                  No recent activity logged.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
