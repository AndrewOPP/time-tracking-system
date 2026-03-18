export const CellFormat = ({ format }: { format: string }) => (
  <div className="flex items-start justify-start px-4 text-[#1F1F1F] w-full">
    {format === 'FULL_TIME' ? 'Full-time' : 'Part-time'}
  </div>
);
