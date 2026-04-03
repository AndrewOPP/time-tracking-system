import { Badge } from '@components/ui';

export const CandidateSkills = ({ actualSkills }: { actualSkills?: string[] }) => {
  if (!actualSkills || actualSkills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {actualSkills.map(skill => (
        <Badge key={skill} className="bg-slate-100 text-slate-700 text-xs px-2 py-1">
          {skill}
        </Badge>
      ))}
    </div>
  );
};
