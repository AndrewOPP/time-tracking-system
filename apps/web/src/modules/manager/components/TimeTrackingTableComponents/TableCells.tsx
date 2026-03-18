import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { CellList } from './CellList';
import { FastUserAvatar } from './FastUserAvatar';
import { FastProjectAvatar } from './FastProjectAvatar';
import type { ManagerDashboardRow } from '../../types/managerAIChat.types';

const buildProjectPath = (projectId: string) => `${ROUTES.DASHBOARD}/${projectId}`;

export const CellEmployee = ({ name, avatarUrl }: { name: string; avatarUrl: string | null }) => (
  <div className="flex items-center gap-2 px-5 w-[230px]">
    <FastUserAvatar src={avatarUrl ?? ''} name={name} className="h-4 w-4 shrink-0" />
    <span className="text-[14px] text-[#1F1F1F] font-medium truncate flex-1 w-[20px]" title={name}>
      {name}
    </span>
  </div>
);

export const CellProjects = ({ projects }: { projects: ManagerDashboardRow['projects'] }) => (
  <CellList
    items={projects}
    renderItem={project => (
      <Link
        className="flex items-center gap-2 w-full group cursor-pointer rounded-md hover:bg-gray-100 transition-all duration-200"
        to={buildProjectPath(project.projectId)}
      >
        <FastProjectAvatar src={project.projectAvatarUrl ?? ''} name={project.projectName} />
        <span
          className="text-[#1F1F1F] text-[14px] truncate flex-1 w-[250px]"
          title={project.projectName}
        >
          {project.projectName}
        </span>
      </Link>
    )}
  />
);

export const CellWeek = ({
  projects,
  weekNumber,
}: {
  projects: ManagerDashboardRow['projects'];
  weekNumber: number;
}) => (
  <CellList
    items={projects}
    renderItem={project => {
      const val = Number(project.weeks[`week${weekNumber}` as keyof typeof project.weeks]);
      return (
        <div className="flex items-center gap-2 w-full">
          <FastProjectAvatar src={project.projectAvatarUrl ?? ''} name={project.projectName} />
          <span className="text-[#1F1F1F] text-[14px]">{val === 0 ? '0' : val.toFixed(2)}</span>
        </div>
      );
    }}
  />
);

export const CellPerProjectTotal = ({
  projects,
}: {
  projects: ManagerDashboardRow['projects'];
}) => (
  <CellList
    items={projects}
    renderItem={project => (
      <div className="flex flex-row items-center gap-2 w-[130px]">
        <FastProjectAvatar src={project.projectAvatarUrl ?? ''} name={project.projectName} />
        <span className="text-[#1F1F1F]">
          {Number(project.perProjectTotal) === 0 ? '0' : Number(project.perProjectTotal).toFixed(2)}
        </span>
      </div>
    )}
  />
);

export const CellTotal = ({ value }: { value: number }) => (
  <div className="flex items-center justify-end px-4 text-[#1F1F1F] w-full">{value}</div>
);

export const CellEmployedTime = ({ percent }: { percent: number }) => (
  <div className="flex items-center px-4 gap-2 w-full">
    <span className="text-sm font-medium w-10 text-[#1F1F1F]">{percent}%</span>
  </div>
);

export const CellPm = ({ projects }: { projects: ManagerDashboardRow['projects'] }) => (
  <CellList
    items={projects}
    renderItem={project => (
      <div className="flex items-center gap-2">
        <FastUserAvatar
          src={project.pmAvatarUrl ?? ''}
          name={project.pmName ?? 'PM'}
          className="h-4 w-4 shrink-0"
        />
        <span className="text-[14px] text-[#1F1F1F] truncate flex-1" title={project.pmName}>
          {project.pmName}
        </span>
      </div>
    )}
  />
);

export const CellFormat = ({ format }: { format: string }) => (
  <div className="flex items-start justify-start px-4 text-[#1F1F1F] w-full">
    {format === 'FULL_TIME' ? 'Full-time' : 'Part-time'}
  </div>
);
