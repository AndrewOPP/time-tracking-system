import {
  FileText,
  Calculator,
  Building2,
  CircleUserRound,
  Clock8,
  User,
  Plane,
} from 'lucide-react';

const GET_COLUMNS_CONFIG = {
  fullWeekHours: 40,
};

export const HeaderEmployee = () => (
  <div className="flex items-center gap-1.5 w-57.5">
    <User className="h-4 w-4 shrink-0" />
    Employee
  </div>
);

export const HeaderProjects = () => (
  <div className="flex items-center gap-1.5 w-[250px]">
    <FileText className="h-4 w-4 shrink-0" />
    Projects
  </div>
);

export const HeaderWeek = ({
  weekNumber,
  workingHours,
}: {
  weekNumber: number;
  workingHours: number;
}) => {
  const isFullWeek = workingHours >= GET_COLUMNS_CONFIG.fullWeekHours;
  const dotColor = isFullWeek ? 'bg-[#4E916B]' : 'bg-[#F97316]';

  return (
    <div className="flex items-center gap-2 w-[120px]">
      <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotColor}`} />
      <span className="text-[#6F6F6F] font-medium whitespace-nowrap">
        Week {weekNumber} [{workingHours}h]
      </span>
    </div>
  );
};

export const HeaderTotal = () => (
  <div className="flex items-center justify-center gap-1.5 w-[70px]">
    <Calculator className="h-4 w-4 shrink-0" />
    Total
  </div>
);

export const HeaderEmployedTime = () => (
  <div className="flex items-center gap-1.5">
    <Clock8 className="h-4 w-4 shrink-0" />
    Employed Time %
  </div>
);

export const HeaderPto = () => (
  <div className="flex items-center justify-end gap-1.5 w-full">
    <Plane className="h-4 w-4 shrink-0" />
    PTO Hours
  </div>
);

export const HeaderPm = () => (
  <div className="flex items-center gap-1.5">
    <CircleUserRound className="h-4 w-4 shrink-0" />
    PM
  </div>
);

export const HeaderFormat = () => (
  <div className="flex items-start justify-start gap-1.5 w-[100px]">
    <Building2 className="h-4 w-4 shrink-0" />
    Format
  </div>
);
