import { axiosPrivate } from '@/shared/api';

export interface Project {
  id: string;
  name: string;
  logo: string | null;
  status: string;
  teamAvatars: string[];
  totalTeamMembers: number;
  totalLoggedHours: number;
}

export const fetchProjects = async (): Promise<Project[]> => {
  const { data } = await axiosPrivate.get<Project[]>('/projects');
  return data;
};
