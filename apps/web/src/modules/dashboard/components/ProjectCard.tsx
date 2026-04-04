import { Clock } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import type { Project } from '../types/project.api.types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { statusConfig } from '@/shared/config/projectStatusConfig';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const currentStatus = statusConfig[project.status] || statusConfig.NOT_STARTED;
  const navigate = useNavigate();
  console.log(project, 'project');

  return (
    <Card
      onClick={() => navigate(`${ROUTES.DASHBOARD}/${project.id}`)}
      className="w-full max-w-[320px] py-4 rounded-2xl border-gray-200 shadow-none hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
    >
      <CardContent className="px-5">
        <div className="flex gap-4 items-center">
          <div className="w-[68px] h-[68px]  rounded-[14px] flex items-center justify-center shrink-0">
            {project.logo ? (
              <img
                src={project.logo}
                alt={project.name}
                className="w-full h-full rounded-[14px] object-cover"
              />
            ) : (
              <span className="text-[#34D399] font-medium text-lg tracking-wide">Лого</span>
            )}
          </div>

          <div className="flex flex-col justify-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 leading-none line-clamp-1">
              {project.name}
            </h3>

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
      </CardContent>

      <div className="px-5">
        <hr className="border-gray-200" />
      </div>

      <CardFooter className="flex justify-between items-center px-5">
        <div className="flex -space-x-2">
          {project.teamAvatars.length > 0 ? (
            <>
              {project.teamAvatars.slice(0, 5).map((avatar, index) => (
                <Avatar key={index} className="w-9 h-9 border-2 border-white ring-0">
                  <AvatarImage src={avatar} alt={`Team member ${index + 1}`} />
                  <AvatarFallback className="text-xs">U</AvatarFallback>
                </Avatar>
              ))}

              {project.teamAvatars.length > 5 && (
                <Avatar className="w-9 h-9 border-2 border-white ring-0">
                  <AvatarFallback className="text-[11px] font-medium bg-gray-100 text-gray-600">
                    +{project.teamAvatars.length - 5}
                  </AvatarFallback>
                </Avatar>
              )}
            </>
          ) : (
            <span className="text-sm text-slate-400 font-medium ml-2">No team</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-slate-700">
          <span className="font-medium text-sm">{project.totalLoggedHours}h</span>
          <Clock className="w-[18px] h-[18px] text-slate-400" />
        </div>
      </CardFooter>
    </Card>
  );
};
