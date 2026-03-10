import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { Briefcase } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { LogTimeFormInput } from '../../hooks/useLogTimeForm';
import type { Project } from '../../types/timeLogs';
import { ProjectStatus } from '@/shared/constants/projectStatus';

interface Props {
  control: Control<LogTimeFormInput>;
  errors: FieldErrors<LogTimeFormInput>;
  projects: Project[];
}

export const ProjectSelect = ({ control, errors, projects }: Props) => {
  return (
    <div className="flex flex-col px-5">
      <label className="font-semibold text-[16px] text-gray-900 pb-3">
        Project <span className="text-[#4E916B]">*</span>
      </label>

      <Controller
        name="project"
        control={control}
        render={({ field }) => {
          const activeProjects =
            projects?.filter(project => project.status === ProjectStatus.IN_PROGRESS) || [];

          return (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                className={`cursor-pointer w-full h-[48px] rounded-[6px] border ${
                  errors.project ? 'border-red-500' : 'border-[#D0D5DD] shadow-none'
                } bg-white text-[16px] pl-10 relative`}
              >
                <Briefcase className="absolute left-3 w-5 h-5 text-[#667085]" />
                <SelectValue placeholder="Select project" />
              </SelectTrigger>

              <SelectContent
                position="popper"
                align="start"
                sideOffset={4}
                className="rounded-[12px] border border-[#EAECF0] bg-white shadow-none"
              >
                {activeProjects.length > 0 ? (
                  activeProjects.map(project => (
                    <SelectItem className="cursor-pointer py-2" key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="py-2 px-2 text-sm text-[#667085] text-center cursor-default outline-none">
                    You have no active projects
                  </div>
                )}
              </SelectContent>
            </Select>
          );
        }}
      />

      <span className="text-red-500 text-sm mt-1 min-h-[20px] block">
        {errors.project?.message}
      </span>
    </div>
  );
};
