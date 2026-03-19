import React from 'react';
import type { EmployeeProfileResponse } from '../types/employee.types';

const PARTICLES = [...Array(20)].map((_, i) => ({
  id: i,
  size: [1, 1.5, 2][i % 3],
  top: Math.random() * 100,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 15 + Math.random() * 10,
  opacity: 0.3 + Math.random() * 0.4,
}));

const VIBE_GRADIENTS = [
  'bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950', // 0. Original Space
  'bg-gradient-to-r from-slate-950 via-teal-900 to-slate-950', // 1. Ocean Depth (Глубокий бирюзовый)
  'bg-gradient-to-r from-gray-950 via-rose-950 to-gray-950', // 2. Midnight Rose (Темно-бордовый)
  'bg-gradient-to-r from-fuchsia-950 via-violet-900 to-fuchsia-950', // 3. Neon Night (Неоновый фиолетовый)
  'bg-gradient-to-r from-emerald-950 via-green-900 to-emerald-950', // 4. Emerald Dream (Темный изумруд)
  'bg-gradient-to-r from-blue-950 via-cyan-900 to-blue-950', // 5. Cyber Blue (Холодный синий)
  'bg-gradient-to-r from-stone-950 via-orange-950 to-stone-950', // 6. Mars Sunset (Темно-оранжевый)
];

const getGradientForUser = (username: string) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return VIBE_GRADIENTS[Math.abs(hash) % VIBE_GRADIENTS.length];
};

interface ProfileHeroProps {
  user: EmployeeProfileResponse;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({ user }) => {
  const bannerBackgroundClass = getGradientForUser(user.username);

  return (
    <div className="relative w-full rounded-2xl bg-white shadow-sm border border-gray-100 flex flex-col items-center pb-8 mt-2">
      <div
        className={`relative w-full h-48 md:h-56 rounded-t-2xl overflow-hidden ${bannerBackgroundClass}`}
      >
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
              <div className="w-full h-full bg-white rounded-[1px] rotate-45 blur-[1.5px]"></div>
            </div>
          ))}
        </div>

        <div className="absolute -top-20 -left-20 w-60 h-60 bg-white rounded-full mix-blend-overlay filter blur-[80px] opacity-20 animate-drift-slow"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white rounded-full mix-blend-overlay filter blur-[80px] opacity-20 animate-drift-slow delay-1000"></div>
      </div>

      <div className="absolute top-28 md:top-36 flex justify-center w-full">
        <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-md bg-white overflow-hidden">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-4xl font-bold">
              {user.fullName.charAt(0)}
            </div>
          )}
        </div>
      </div>

      <div className="mt-20 flex flex-col items-center px-4 w-full">
        <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
        <p className="text-gray-500 font-medium">{user.systemRole}</p>

        <div className="flex items-center gap-2 mt-2">
          <span className="flex items-center gap-1.5 text-sm text-gray-600">
            <span
              className={`w-2 h-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'}`}
            ></span>
            {user.status === 'ACTIVE' ? 'Online' : 'Offline'}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-sm text-gray-600">
            {user.workFormat === 'FULL_TIME' ? 'Full-time' : 'Part-time'}
          </span>
        </div>
      </div>
    </div>
  );
};
