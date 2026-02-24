import { axiosPrivate } from '@/shared/api';

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

export const fetchProjects = async (): Promise<Project[]> => {
  const { data } = await axiosPrivate.get<Project[]>('/projects');
  return data;
};

export const fetchProjectById = async (id: string): Promise<ProjectDetails> => {
  // throw Error('test error');

  const { data } = await axiosPrivate.get<ProjectDetails>(`/projects/${id}`);
  return data;
};
