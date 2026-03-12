import { FileText, LayoutList, User, Calendar, Globe } from 'lucide-react';
import { Card } from '@ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar';
import { cn } from '@/shared/lib/utils';
import { formatToEnglishDate } from '../utils/formatToEnglishDate';
import type { ProjectDetails } from '../types/project.api.types';

interface ProjectSidebarProps {
  project: ProjectDetails;
  currentStatus: { bg: string; dot: string; label: string };
}

export const ProjectSidebar = ({ project, currentStatus }: ProjectSidebarProps) => {
  return (
    <div className="w-full lg:w-[420px] shrink-0 flex flex-col ">
      <Card className="px-6 py-5 rounded-[16px] shadow-none border-gray-200 gap-4">
        <div className="flex items-center gap-2  text-slate-900 font-bold font-exo text-[18px]">
          <FileText className="w-5 h-5 text-gray-400" />
          Project Details
        </div>

        <div className="flex flex-col gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-2">
              <LayoutList className="w-4 h-4" /> Status
            </span>
            <div
              className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-md', currentStatus.bg)}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', currentStatus.dot)} />
              <span className="text-[13px] font-medium text-slate-800 leading-none">
                {currentStatus.label}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-2">
              <User className="w-4 h-4" /> PM
            </span>
            <div className="flex items-center gap-2 font-medium text-slate-900">
              <Avatar className="w-6 h-6">
                <AvatarImage src={project.pm?.avatarUrl || undefined} />
                <AvatarFallback className="bg-gray-200 text-xs">PM</AvatarFallback>
              </Avatar>
              <span className="truncate max-w-[120px]" title={project.pm?.name}>
                {project.pm?.name || 'Unassigned'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Start Date
            </span>
            <span className="font-medium text-slate-900">
              {formatToEnglishDate(project.startDate)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Domain
            </span>
            <span className="font-medium text-slate-900">
              {project.domain?.slice(0, 3).join(', ') || '—'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
