import { getBarColor, getScoreColor } from '@/modules/manager/utils/scoring';
import { Progress } from '@components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip';
import type { ReactNode } from 'react';

interface CandidateProgressBarProps {
  label: string;
  score: number;
  reasoning: ReactNode;
  weight: number;
  overtimePercent?: number;
}

export const CandidateProgressBar = ({
  label,
  score,
  reasoning,
  weight,
  overtimePercent,
}: CandidateProgressBarProps) => {
  const isActive = weight > 0;
  const weightPercentage = Math.round(weight);

  const hasOvertime = label === 'Availability' && !!overtimePercent && overtimePercent > 0;

  const progressValue = hasOvertime ? Math.min(overtimePercent, 100) : Math.max(0, score);

  const barColor = !isActive ? 'bg-slate-300' : hasOvertime ? 'bg-red-500' : getBarColor(score);

  const scoreTextColor = !isActive
    ? 'text-slate-400'
    : hasOvertime
      ? 'text-red-500'
      : getScoreColor(score);

  const ProgressBarContent = (
    <div
      className={`transition-opacity ${!isActive ? 'opacity-60 grayscale' : 'cursor-help opacity-100'}`}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-slate-500 text-xs flex items-center gap-1.5">
          {label}
          {isActive ? (
            <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
              w. {weightPercentage}%
            </span>
          ) : (
            <span className="italic text-[10px] text-slate-400">(Ignored)</span>
          )}
        </span>
        <span className={`font-semibold text-sm ${scoreTextColor}`}>{score}</span>
      </div>

      <Progress value={progressValue} indicatorClassName={barColor} className="h-2 bg-slate-100" />
    </div>
  );

  if (!isActive) return ProgressBarContent;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{ProgressBarContent}</TooltipTrigger>
      <TooltipContent className="max-w-[250px] text-xs leading-relaxed">{reasoning}</TooltipContent>
    </Tooltip>
  );
};
