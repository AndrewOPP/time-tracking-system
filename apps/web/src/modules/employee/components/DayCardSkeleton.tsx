import { Skeleton } from '@components/ui/skeleton';

interface DayCardSkeletonProps {
  index?: number;
}

export const DayCardSkeleton = ({ index = 0 }: DayCardSkeletonProps) => {
  return (
    <div
      className="w-full flex flex-col mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both',
      }}
    >
      <div className="h-[72px] py-4 px-6 flex items-center justify-between border border-gray-200 rounded-t-[12px] bg-gray-50/50">
        <div className="flex items-center gap-4">
          <Skeleton className="h-7 w-[46px] rounded-md" />

          <Skeleton className="h-6 w-[180px] sm:w-[220px]" />
        </div>

        <Skeleton className="h-9 w-[120px] rounded-lg" />
      </div>

      <div className="border-x border-b border-gray-200 rounded-b-[12px] bg-white flex flex-col">
        <div className="min-h-[74px] py-[28px] px-[24px] flex items-start gap-[16px]">
          <Skeleton className="h-5 w-8 mt-0.5" />

          <div className="flex-1 flex flex-col gap-2 mt-0.5">
            <Skeleton className="h-5 w-[140px]" />
            <Skeleton className="h-4 w-3/4 max-w-[400px]" />
          </div>

          <div className="flex items-center gap-3 mt-0.5">
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton className="h-6 w-6 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};
