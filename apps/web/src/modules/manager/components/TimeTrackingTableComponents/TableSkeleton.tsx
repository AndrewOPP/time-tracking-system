import { Skeleton } from '@components/ui/skeleton';

export const TableSkeleton = () => {
  return (
    <div className="w-full">
      <div className="rounded-md border border-[#E0E1E2] bg-white overflow-hidden  min-h-[686px]">
        <div className="flex border-b border-[#E0E1E2] bg-gray-50 p-4 gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="p-4 space-y-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-48">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex gap-4 opacity-50">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
