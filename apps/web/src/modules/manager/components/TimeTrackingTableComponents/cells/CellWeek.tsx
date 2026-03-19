import { CellList } from '../CellList';
import { FastProjectAvatar } from '../FastProjectAvatar';
import type { ManagerDashboardRow } from '../../../types/managerAIChat.types';

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
