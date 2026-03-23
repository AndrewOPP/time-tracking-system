import { Skeleton } from '@components/ui/skeleton';

export const UserProfileSkeleton = () => {
  return (
    <div className="flex flex-col w-full animate-in fade-in zoom-in-[0.98] duration-500 ease-out">
      <div className="flex flex-col gap-2 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 pt-0">
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 w-full overflow-hidden">
            <Skeleton className="w-full h-24 rounded-none" />
            <div className="px-6 pb-6 flex flex-col items-center relative">
              <Skeleton className="w-20 h-20 rounded-full border-4 border-white -mt-10 z-10" />
              <Skeleton className="h-6 w-40 mt-3" />
              <Skeleton className="h-4 w-28 mt-2" />

              <div className="flex flex-col gap-4 w-full pt-5 mt-5 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-6 w-16 rounded-md" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 flex flex-col gap-4 border border-gray-200 w-full"
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 w-full flex flex-col">
            <div className="pt-6 px-6">
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="flex justify-center items-center p-6 py-10 h-[448px]">
              <Skeleton className="h-[320px] w-[320px] rounded-full" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 w-full overflow-hidden flex flex-col">
            <div className="flex border-b border-gray-100 px-6 pt-4 gap-8">
              <Skeleton className="h-5 w-28 mb-4" />
              <Skeleton className="h-5 w-28 mb-4" />
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="flex justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>

              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
