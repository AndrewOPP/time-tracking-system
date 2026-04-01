import { Badge } from '@components/ui';

export const CandidateSkills = ({ skills }: { skills?: string[] }) => {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {skills.map(skill => (
        <Badge key={skill} className="bg-slate-100 text-slate-700 text-xs px-2 py-1">
          {skill}
        </Badge>
      ))}
    </div>
  );
};
