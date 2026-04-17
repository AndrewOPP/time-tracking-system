import { Card, CardContent } from '@components/ui';
import { cn } from '@lib/index';

interface KpiCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  className?: string;
}

export function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  iconBg,
  className,
}: KpiCardProps) {
  return (
    <Card
      className={cn('border-slate-200 transition-all flex flex-col justify-center py-0', className)}
    >
      <CardContent className="p-5 flex justify-between items-center gap-4 h-full">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">{description}</p>
        </div>

        <div className={cn('p-3 rounded-xl shrink-0', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} strokeWidth={2} />
        </div>
      </CardContent>
    </Card>
  );
}
