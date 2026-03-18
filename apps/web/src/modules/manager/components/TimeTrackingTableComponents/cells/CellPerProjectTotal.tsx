import { CellList } from '../CellList';
import { FastProjectAvatar } from '../FastProjectAvatar';
import type { ManagerDashboardRow } from '../../../types/managerAIChat.types';

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
