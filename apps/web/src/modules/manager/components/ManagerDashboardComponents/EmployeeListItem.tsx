import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Badge } from '@components/ui/badge';
import { cn } from '@lib/index';
import { Link } from 'react-router-dom';

interface EmployeeListItemProps {
  employee: {
    id: string;
    username: string;
    name: string;
    avatarUrl: string;
    workFormat: string;
    loadPercent: number;
  };
  subtitle: string;
}

export function EmployeeListItem({ employee, subtitle }: EmployeeListItemProps) {
  const safePercent = Math.min(Math.max(employee.loadPercent, 0), 100);

  let barColor = 'bg-emerald-500';
  let textColor = 'text-emerald-600';

  if (employee.loadPercent >= 80 && employee.loadPercent <= 100) {
    barColor = 'bg-amber-400';
    textColor = 'text-amber-600';
  } else if (employee.loadPercent > 100) {
    barColor = 'bg-red-500';
    textColor = 'text-red-600';
  }

  return (
    <Link
      to={`/profile/${employee.username}`}
      className="block p-4 hover:bg-slate-50 transition-colors group"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border-2 border-white shrink-0">
            <AvatarImage src={employee.avatarUrl} alt={employee.name} />
            <AvatarFallback className="text-xs bg-slate-100 font-semibold text-slate-600">
              {employee.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {employee.name}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
              <Badge
                variant="outline"
                className="text-[9px] px-1.5 py-0 font-medium uppercase text-slate-500 border-slate-200"
              >
                {employee.workFormat.replace('_', '-')}
              </Badge>
              <span>•</span>
              <span>{subtitle}</span>
            </div>
          </div>
        </div>
        <div className={cn('font-semibold text-sm shrink-0 mt-1', textColor)}>
          {employee.loadPercent}%
        </div>
      </div>

      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-3">
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', barColor)}
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </Link>
  );
}
