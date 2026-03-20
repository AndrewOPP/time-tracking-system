import type { ProjectData, WeekInfo } from '@/modules/manager/types/managerAIChat.types';
import { EmployedTimeBar } from '../EmployedTimeBar';

type Props = {
  weeksInfo: WeekInfo[];
  totalUserHours: number;
  projects: ProjectData[];
};

export const CellEmployedTime = ({ weeksInfo, totalUserHours, projects }: Props) => (
  <div className="flex items-center px-5 w-62">
    <EmployedTimeBar weeksInfo={weeksInfo} totalUserHours={totalUserHours} projects={projects} />
  </div>
);
