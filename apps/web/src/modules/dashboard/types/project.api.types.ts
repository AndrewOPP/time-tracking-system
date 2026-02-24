export interface TeamMember {
  id: string;
  name: string;
  position: string;
  avatarUrl: string;
}

export interface Project {
  id: string;
  name: string;
  logo: string | null;
  status: string;
  teamAvatars: string[];
  totalTeamMembers: number;
  totalLoggedHours: number;
}

export interface ProjectDetails {
  id: string;
  description: string;
  name: string;
  domain: string;
  logo: string | null;
  status: string;
  startDate: string;
  teamAvatars: string[];
  pm: { name: string; avatarUrl: string | null };
  team: TeamMember[];
  totalTeamMembers: number;
  totalLoggedHours: number;
}
