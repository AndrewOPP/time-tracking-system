import { Users } from 'lucide-react';
import { Card } from '@ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar';
import type { TeamMember } from '../types/project.api.types';
import { Link } from 'react-router-dom';

interface ProjectTeamProps {
  team: TeamMember[];
}

export const ProjectTeam = ({ team }: ProjectTeamProps) => {
  return (
    <Card className="px-6 py-5 rounded-[16px] shadow-none border-gray-200">
      <div className="flex items-center gap-2 text-slate-900 font-bold font-exo text-[18px]">
        <Users className="w-5 h-5 text-gray-400" />
        Team Members
      </div>

      <div className="flex flex-col gap-4">
        {team.length > 0 ? (
          team.map(member => (
            <div key={member.id}>
              <Link className="flex items-center gap-3" to={`/profile/${member.username}`}>
                <Avatar className="w-9 h-9">
                  <AvatarImage src={member.avatarUrl} />
                  <AvatarFallback className="bg-gray-200 text-xs">EMP</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-slate-700">{member.name}</span>
              </Link>
            </div>
          ))
        ) : (
          <span className="text-sm text-gray-400">No team members assigned.</span>
        )}
      </div>
    </Card>
  );
};
