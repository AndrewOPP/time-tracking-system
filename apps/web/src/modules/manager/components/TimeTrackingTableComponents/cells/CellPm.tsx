import { CellList } from '../CellList';
import { FastUserAvatar } from '../FastUserAvatar';
import type { ManagerDashboardRow } from '../../../types/managerAIChat.types';

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
