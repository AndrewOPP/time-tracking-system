import React, { useState } from 'react';
import type { EmployeeProfileResponse } from '../types/employee.types';

interface ProfileDetailsProps {
  user: EmployeeProfileResponse;
}

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'activity'>('projects');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6 w-full">
      <div className="flex border-b border-gray-100 px-6 pt-4">
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-4 px-2 mr-6 text-sm font-medium transition-colors ${
            activeTab === 'projects'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Project History
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-4 px-2 text-sm font-medium transition-colors ${
            activeTab === 'activity'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Recent Activity
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'projects' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-sm text-gray-400">
                  <th className="pb-3 font-medium">Project Name</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {user.projects.length > 0 ? (
                  user.projects.map(project => (
                    <tr
                      key={project.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                            {project.name.charAt(0)}
                          </div>
                          {project.name}
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {project.userPosition
                          .replace('_', ' ')
                          .toLowerCase()
                          .replace(/\b\w/g, l => l.toUpperCase())}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            project.projectType === 'BILLABLE'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {project.projectType === 'BILLABLE' ? 'Billable' : 'Non-billable'}
                        </span>
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            project.userProjectStatus === 'ACTIVE'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {project.userProjectStatus.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-gray-400">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-sm text-gray-400">
                  <th className="pb-3 font-medium w-32">Date</th>
                  <th className="pb-3 font-medium w-48">Project</th>
                  <th className="pb-3 font-medium w-24 text-right">Hours</th>
                  <th className="pb-3 font-medium pl-8">Task Description</th>
                </tr>
              </thead>
              <tbody>
                {user.recentTimeLogs.length > 0 ? (
                  user.recentTimeLogs.map(log => (
                    <tr
                      key={log.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(log.date)}
                      </td>
                      <td className="py-4 text-sm font-medium text-gray-900">{log.projectName}</td>
                      <td className="py-4 text-sm font-semibold text-gray-700 text-right">
                        {log.hours.toFixed(1)}h
                      </td>
                      <td className="py-4 text-sm text-gray-600 pl-8">{log.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-gray-400">
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
