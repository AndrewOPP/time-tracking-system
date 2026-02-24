import { Clock } from 'lucide-react';
import { Card } from '@ui/card';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@ui/tooltip';
import type { ProjectDetails } from '../types/project.api';

interface ProjectHeaderProps {
  project: ProjectDetails;
  currentStatus: { bg: string; dot: string; label: string };
  isTrackingDisabled: boolean;
}

export const ProjectHeader = ({
  project,
  currentStatus,
  isTrackingDisabled,
}: ProjectHeaderProps) => {
  return (
    <Card className="p-6 rounded-[16px] shadow-none border-gray-200 flex flex-col min-[1155px]:flex-row items-start min-[1155px]:items-center justify-between gap-4">
      <div className="flex gap-4 items-center">
        <div className="w-[68px] h-[68px] bg-[#1C1C1C] rounded-[14px] flex items-center justify-center shrink-0 overflow-hidden">
          {project.logo ? (
            <img src={project.logo} alt={project.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[#34D399] font-medium text-lg tracking-wide">Logo</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold font-exo text-slate-900 leading-none">
            {project.name}
          </h1>
          <div
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md w-fit',
              currentStatus.bg
            )}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full', currentStatus.dot)} />
            <span className="text-[13px] font-medium text-slate-800 leading-none">
              {currentStatus.label}
            </span>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        {isTrackingDisabled ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-not-allowed">
                <Button
                  disabled={true}
                  className="flex items-center gap-2 rounded-lg font-medium pointer-events-none"
                >
                  <Clock className="w-4 h-4" />
                  Log Hours
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[250px] text-center">
              <p>Time tracking is unavailable for Completed / Paused projects</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button className="flex items-center gap-2 rounded-lg font-medium bg-[#489B74] hover:bg-[#3d8362] text-white cursor-pointer">
            <Clock className="w-4 h-4" />
            Log Hours
          </Button>
        )}
      </div>
    </Card>
  );
};
