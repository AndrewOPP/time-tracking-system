import { CellList } from '../CellList';
import { FastProjectAvatar } from '../FastProjectAvatar';
import type { ManagerDashboardRow } from '../../../types/managerAIChat.types';
import { calculateTotalWeekHours } from '@/modules/manager/utils/calculateTotalWeekHours';

export const CellWeek = ({
  projects,
  weekNumber,
}: {
  projects: ManagerDashboardRow['projects'];
  weekNumber: number;
}) => {
  const totalHoursRounded = calculateTotalWeekHours(projects, weekNumber);

  return (
    <div className="flex flex-row w-full h-full  items-end">
      <CellList
        items={projects}
        renderItem={project => {
          const val = Number(project.weeks[`week${weekNumber}` as keyof typeof project.weeks]) || 0;
          return (
            <div className="flex items-center gap-2 w-full ">
              <FastProjectAvatar src={project.projectAvatarUrl ?? ''} name={project.projectName} />
              <span className="text-[#1F1F1F] text-[14px]">{val === 0 ? '0' : val.toFixed(2)}</span>
            </div>
          );
        }}
      />

      {totalHoursRounded > 0 ? (
        <div className="w-full pr-1 mt-auto text-right">
          <span className="text-[#6F6F6F] text-[12px] font-normal mr-1">Total:</span>
          <span className="text-[#1F1F1F] text-[12px] font-normal">{totalHoursRounded}h</span>
        </div>
      ) : null}
    </div>
  );
};
