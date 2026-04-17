import { Skeleton } from '@components/ui/skeleton';

export const ScoringCardsSkeleton = () => {
  const skeletons = [1];

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto my-6 w-full">
      {skeletons.map(i => (
        <div
          style={{
            animationDelay: `${i * 100}ms`,
            animationFillMode: 'backwards',
          }}
          key={i}
          className="p-6 rounded-xl border bg-card text-card-foreground w-full animate-in fade-in duration-500 ease-out"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2 w-1/3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-10 w-16 rounded-lg" />
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-2 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-2 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-2 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
