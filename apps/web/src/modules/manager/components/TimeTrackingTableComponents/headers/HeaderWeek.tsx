const GET_COLUMNS_CONFIG = {
  fullWeekHours: 40,
};

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
