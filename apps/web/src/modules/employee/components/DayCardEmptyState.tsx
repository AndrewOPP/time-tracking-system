export const DayCardEmptyState = ({ emptyText }: { emptyText: string }) => {
  return (
    <div className="min-h-[72px] py-[20px] px-[24px] flex items-center gap-[16px]">
      <span className="text-gray-900 font-semibold text-sm min-w-[3rem] text-center">0.0</span>
      <span className="text-[#6F6F6F] text-sm">{emptyText}</span>
    </div>
  );
};
