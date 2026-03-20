import React, { useState } from 'react';
import type { EmployeeProfileResponse } from '../types/employee.types';
import type { UserTheme } from '../utils/getUserTheme';

// Строго типизируем возможные табы
type TabOption = 'projects' | 'activity';

export const ProfileDetails: React.FC<{ user: EmployeeProfileResponse; theme: UserTheme }> = ({
  user,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<TabOption>('projects');

  // Массив табов с явным указанием типа
  const TABS: TabOption[] = ['projects', 'activity'];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6 w-full overflow-hidden">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-100 px-6 pt-4">
        {TABS.map(t => (
          <button
            key={t}
            // Теперь TS точно знает, что t — это 'projects' | 'activity', никакого any!
            onClick={() => setActiveTab(t)}
            className={`pb-4 px-2 mr-6 text-sm font-semibold relative capitalize transition-colors ${
              activeTab === t ? theme.text : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {t === 'projects' ? 'Project History' : 'Recent Activity'}
            {activeTab === t && (
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${theme.border}`} />
            )}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === 'projects' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] uppercase text-gray-400 font-bold">
                  <th className="pb-4">Project</th>
                  <th className="pb-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {user.projects.length > 0 ? (
                  user.projects.map(p => (
                    <tr key={p.id} className="group transition-colors hover:bg-gray-50/50">
                      <td className="py-4 flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${theme.bg} ${theme.text}`}
                        >
                          {p.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{p.name}</span>
                      </td>
                      <td className="py-4 text-right">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                            p.userProjectStatus === 'ACTIVE'
                              ? `${theme.bg} ${theme.text}`
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {p.userProjectStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="py-8 text-center text-sm text-gray-400">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* RECENT ACTIVITY TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] uppercase text-gray-400 font-bold">
                  <th className="pb-4 w-32">Date</th>
                  <th className="pb-4 w-48">Project</th>
                  <th className="pb-4 text-right">Hours</th>
                  <th className="pb-4 pl-8">Task Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {user.recentTimeLogs.length > 0 ? (
                  user.recentTimeLogs.map(log => (
                    <tr key={log.id} className="group transition-colors hover:bg-gray-50/50">
                      <td className="py-4 text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(log.date)}
                      </td>
                      <td className="py-4 text-sm font-medium text-gray-900">{log.projectName}</td>
                      <td className={`py-4 text-sm font-bold text-right ${theme.text}`}>
                        {log.hours.toFixed(1)}h
                      </td>
                      <td className="py-4 text-sm text-gray-600 pl-8">{log.description}</td>
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
        )}
      </div>
    </div>
  );
};
