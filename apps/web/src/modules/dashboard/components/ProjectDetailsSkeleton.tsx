import { Skeleton } from '@components/ui/skeleton';
import { BackButton } from './BackButton';
import { ROUTES } from '@/shared/constants/routes';

export default function ProjectDetailsSkeleton() {
  return (
    <div className="w-full pb-10">
      <BackButton title="Back to projects" route={ROUTES.DASHBOARD} />
      <div className="px-4 flex flex-col lg:flex-row gap-6 items-start">
        <Skeleton className="w-full lg:w-[320px] h-[400px] rounded-[16px]" />

        <div className="flex-1 w-full flex flex-col gap-6">
          <div className="bg-white rounded-[16px] border border-gray-200 p-6 flex flex-col sm:flex-row gap-6 justify-between items-start">
            <div className="flex gap-4 items-center">
              <Skeleton className="w-16 h-16 rounded-[16px]" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>

          <div className="bg-white rounded-[16px] border border-gray-200 p-6 space-y-3">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>

          <div className="bg-white rounded-[16px] border border-gray-200 p-6">
            <Skeleton className="h-6 w-40 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
