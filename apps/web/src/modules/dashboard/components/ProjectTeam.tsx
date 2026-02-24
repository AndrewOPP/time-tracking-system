import { Users } from 'lucide-react';
import { Card } from '@ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar';
import type { TeamMember } from '../types/project.api';

interface ProjectTeamProps {
  team?: TeamMember[];
}

export const ProjectTeam = ({ team }: ProjectTeamProps) => {
  return (
    <Card className="p-6 rounded-[16px] shadow-none border-gray-200">
      <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold font-exo text-[18px]">
        <Users className="w-5 h-5 text-gray-400" />
        Team Members
      </div>

      <div className="flex flex-col gap-4">
        {team && team.length > 0 ? (
          team.map(member => (
            <div key={member.id} className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={member.avatarUrl} />
                <AvatarFallback className="bg-gray-200 text-xs">EMP</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-slate-700">{member.name}</span>
            </div>
          ))
        ) : (
          <span className="text-sm text-gray-400">No team members assigned.</span>
        )}
      </div>
    </Card>
  );
};
