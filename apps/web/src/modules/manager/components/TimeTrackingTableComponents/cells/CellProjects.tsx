import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { buildPath } from '@/shared/utils/buildPath';
import { CellList } from '../CellList';
import { FastProjectAvatar } from '../FastProjectAvatar';
import type { ManagerDashboardRow } from '../../../types/managerAIChat.types';

export const CellProjects = ({ projects }: { projects: ManagerDashboardRow['projects'] }) => (
  <CellList
    items={projects}
    renderItem={project => (
      <Link
        className="flex items-center gap-2 w-full group cursor-pointer rounded-md hover:bg-gray-100 transition-all duration-200"
        to={buildPath(ROUTES.DASHBOARD, project.projectId)}
      >
        <FastProjectAvatar src={project.projectAvatarUrl ?? ''} name={project.projectName} />
        <span
          className="text-[#1F1F1F] text-[14px] truncate flex-1 w-62.5"
          title={project.projectName}
        >
          {project.projectName}
        </span>
      </Link>
    )}
  />
);
