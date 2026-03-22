import type { CalculatedEmployedTimeData } from '@/modules/manager/types/managerAIChat.types';
import { EmployedTimeBar } from '../EmployedTimeBar';

type Props = {
  employedTimeData: CalculatedEmployedTimeData;
  totalUserHours: number;
  // projects: ProjectData[];
};

export const CellEmployedTime = ({ employedTimeData, totalUserHours }: Props) => (
  <div className="flex items-center px-5 w-62">
    <EmployedTimeBar employedTimeData={employedTimeData} totalUserHours={totalUserHours} />
  </div>
);
