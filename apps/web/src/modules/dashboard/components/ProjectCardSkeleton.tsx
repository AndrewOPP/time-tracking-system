import { Card, CardContent, CardFooter } from '@/shared/components/ui/card';
import { Skeleton } from '@components/ui/skeleton';

export const ProjectCardSkeleton = () => {
  return (
    <Card className="w-full max-w-[320px] rounded-2xl border-gray-200 shadow-none overflow-hidden">
      <CardContent className="">
        <div className="flex gap-4 items-center">
          <Skeleton className="w-[68px] h-[68px] rounded-[14px] shrink-0" />

          <div className="flex flex-col justify-center gap-2 w-full">
            <Skeleton className="h-5 w-3/4" />

            <Skeleton className="h-[24px] w-[100px] rounded-md" />
          </div>
        </div>
      </CardContent>

      <div className="px-5">
        <hr className="border-gray-200" />
      </div>

      <CardFooter className="flex justify-between items-center">
        <div className="flex -space-x-2">
          <Skeleton className="w-8 h-8 rounded-full border-2 border-white ring-0 shrink-0" />
          <Skeleton className="w-8 h-8 rounded-full border-2 border-white ring-0 shrink-0" />
          <Skeleton className="w-8 h-8 rounded-full border-2 border-white ring-0 shrink-0" />
        </div>

        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="w-[18px] h-[18px] rounded-full shrink-0" />{' '}
        </div>
      </CardFooter>
    </Card>
  );
};
