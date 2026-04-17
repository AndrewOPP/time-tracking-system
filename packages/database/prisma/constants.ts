import { Technology, TechnologyType } from '@prisma/client';

export const CONFIG = {
  USERS_COUNT: 35,
  MANAGERS_COUNT: 5,
  PROJECTS_COUNT: 20,
  PM_PROJECTS_COUNT: Math.floor(20 * 0.9),
  BENCH_VALUE: 0.05,
  MAX_TEAM_SIZE: 6,
};

export const TECHNOLOGIES: Omit<Technology, 'id'>[] = [
  {
    name: 'Node.js',
    type: TechnologyType.BACKEND,
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  },
  {
    name: 'PostgreSQL',
    type: TechnologyType.BACKEND,
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  },
  {
    name: 'React',
    type: TechnologyType.FRONTEND,
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  },
  {
    name: 'Next.js',
    type: TechnologyType.FRONTEND,
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  },
  {
    name: 'TypeScript',
    type: TechnologyType.GENERAL,
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  },
  {
    name: 'Docker',
    type: TechnologyType.GENERAL,
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  },
  {
    name: 'Figma',
    type: TechnologyType.DESIGN,
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  },
  {
    name: 'Adobe XD',
    type: TechnologyType.DESIGN,
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/adobexd/adobexd-plain.svg',
  },
  {
    name: 'OpenAI API',
    type: TechnologyType.AI,
    image: 'https://static.cdnlogo.com/logos/o/38/openai.svg',
  },
  {
    name: 'Python',
    type: TechnologyType.BACKEND,
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  },
];
