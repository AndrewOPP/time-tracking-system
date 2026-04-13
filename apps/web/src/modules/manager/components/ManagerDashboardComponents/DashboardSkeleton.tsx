import { Card, CardContent, CardHeader } from '@components/ui';
import { Skeleton } from '@components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="border-slate-200">
            <CardContent className="p-5 flex justify-between items-center h-full">
              <div className="space-y-3 w-full">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-2 w-32" />
              </div>
              <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-slate-200">
            <CardHeader className="bg-slate-50/50 pb-4">
              <Skeleton className="h-5 w-1/2 mb-2" />
              <Skeleton className="h-3 w-3/4" />
            </CardHeader>
            <CardContent className="p-0">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="p-4 border-b border-slate-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3 items-center">
                      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-10 shrink-0 mt-1" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
