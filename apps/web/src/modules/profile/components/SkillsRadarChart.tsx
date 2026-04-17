import React from 'react';
import type { UserTheme } from '../utils/getUserTheme';

const RADAR_PARTICLE_MAP = [...Array(40)].map((_, i) => ({
  id: i,
  size: [0.6, 1.3, 1.8][i % 3],
  top: Math.random() * 100,
  left: Math.random() * 100,
  delay: Math.random() * 10,
  duration: 18 + Math.random() * 12,
  opacity: 0.08 + Math.random() * 0.2,
}));

const SKILLS = [
  { name: 'Frontend', value: 90 },
  { name: 'Backend', value: 75 },
  { name: 'Jokes', value: 100 },
  { name: 'Design', value: 65 },
  { name: 'AI', value: 70 },
  { name: 'Overall', value: 82 },
];

export const SkillsRadarChart: React.FC<{ theme: UserTheme }> = ({ theme }) => {
  const size = 400;
  const center = size / 2;
  const radius = size * 0.35;

  const getPoint = (i: number, r: number) => {
    const angle = (Math.PI * 2 * i) / SKILLS.length - Math.PI / 2;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 w-full relative overflow-hidden group">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#00000008_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

      <div className="absolute inset-0 z-0 pointer-events-none">
        {RADAR_PARTICLE_MAP.map(particle => (
          <div
            key={particle.id}
            className="absolute animate-float-spin"
            style={{
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              width: `${particle.size * 0.2}rem`,
              height: `${particle.size * 0.2}rem`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `-${particle.delay}s`,
              opacity: particle.opacity,
            }}
          >
            <div
              className="w-full h-full rounded-[1px] rotate-45"
              style={{ backgroundColor: theme.fill }}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 pb-0 pt-6 px-6">
        <h3 className="text-gray-900 font-semibold text-sm">Vibe & Skills</h3>
      </div>

      <div className="relative z-10 flex justify-center p-6">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          <defs>
            <radialGradient id="radarGlow">
              <stop offset="0%" stopColor={theme.fill} stopOpacity="0.25" />
              <stop offset="100%" stopColor={theme.fill} stopOpacity="0.05" />
            </radialGradient>
          </defs>

          {[0.2, 0.4, 0.6, 0.8, 1].map(level => (
            <polygon
              key={level}
              points={SKILLS.map((_, idx) => {
                const p = getPoint(idx, radius * level);
                return `${p.x},${p.y}`;
              }).join(' ')}
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="1.5"
            />
          ))}

          <polygon
            points={SKILLS.map((s, i) => {
              const p = getPoint(i, (s.value / 100) * radius);
              return `${p.x},${p.y}`;
            }).join(' ')}
            fill="url(#radarGlow)"
            stroke={theme.fill}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {SKILLS.map((s, i) => {
            const p = getPoint(i, (s.value / 100) * radius);
            const labelP = getPoint(i, radius + 40);

            return (
              <g key={i}>
                <line
                  x1={center}
                  y1={center}
                  x2={getPoint(i, radius).x}
                  y2={getPoint(i, radius).y}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />

                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4.5"
                  fill={theme.fill}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />

                <text x={labelP.x} y={labelP.y} textAnchor="middle" dominantBaseline="middle">
                  <tspan className="text-[11px] font-semibold fill-gray-500 uppercase tracking-wider">
                    {s.name}
                  </tspan>
                  <tspan className="text-[12px] font-bold" fill={theme.fill} dx="6">
                    {s.value}
                  </tspan>
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
