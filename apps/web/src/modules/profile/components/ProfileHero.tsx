import React from 'react';
import { format } from 'date-fns';
import type { EmployeeProfileResponse } from '../types/employee.types';
import type { UserTheme } from '../utils/getUserTheme';
import { capitalize } from '@/shared/utils/firstCharToUpperCase';

const PARTICLES = [...Array(15)].map((_, i) => ({
  id: i,
  size: [1, 1.5, 2][i % 3],
  top: Math.random() * 100,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 15 + Math.random() * 10,
  opacity: 0.3 + Math.random() * 0.4,
}));

interface ProfileHeroProps {
  user: EmployeeProfileResponse;
  theme: UserTheme;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({ user, theme }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 min-h-85 w-full flex flex-col overflow-hidden">
      <div className={`relative w-full h-24 overflow-hidden ${theme.banner}`}>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-40"></div>
        <div className="absolute inset-0 z-0 overflow-hidden">
          {PARTICLES.map(particle => (
            <div
              key={particle.id}
              className="absolute animate-float-spin"
              style={{
                top: `${particle.top}%`,
                left: `${particle.left}%`,
                width: `${particle.size * 0.25}rem`,
                height: `${particle.size * 0.25}rem`,
                animationDuration: `${particle.duration}s`,
                animationDelay: `-${particle.delay}s`,
                opacity: particle.opacity,
              }}
            >
              <div className="w-full h-full bg-white rounded-[1px] rotate-45 blur-[1px]"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-4 flex flex-col items-center relative">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-4 border-white flex-shrink-0 relative -mt-10 z-10">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
              {user.fullName.charAt(0)}
            </div>
          )}
        </div>

        <h1 className="text-lg font-bold text-gray-900 mt-2 text-center">{user.fullName}</h1>
        <p className="text-sm text-gray-500 font-medium text-center">
          {capitalize(user.systemRole)}
        </p>

        <div className="flex flex-col gap-3 w-full pt-5 mt-5 border-t border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Status</span>
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${user.status === 'ACTIVE' ? 'bg-[#23d36c]/10 text-[#23d36c]' : 'bg-[#f82f2f]/10 text-[#f82f2f]'}`}
            >
              {user.status === 'ACTIVE' ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Work Format</span>
            <span className="text-gray-900 font-medium pr-1">
              {user.workFormat === 'FULL_TIME' ? 'Full-time' : 'Part-time'}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Joined</span>
            <span className="text-gray-900 font-medium pr-1">
              {format(new Date(user.createdAt), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
