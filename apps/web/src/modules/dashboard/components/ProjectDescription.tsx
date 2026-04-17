import { FileText } from 'lucide-react';
import { Card } from '@ui/card';

interface ProjectDescriptionProps {
  description?: string;
}

export const ProjectDescription = ({ description }: ProjectDescriptionProps) => {
  return (
    <Card className="gap-4 px-6 py-5 rounded-[16px] shadow-none border-gray-200">
      <div className="flex items-center gap-2 text-slate-900 font-bold font-exo text-[18px]">
        <FileText className="w-5 h-5 text-gray-400" />
        Project Description
      </div>
      <div className="text-slate-500 text-sm leading-relaxed whitespace-pre-wrap font-onest">
        {description || 'No description available.'}
      </div>
    </Card>
  );
};
