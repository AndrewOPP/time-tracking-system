import { axiosPrivate } from '@/shared/api';
import type { Project, ProjectDetails } from '../types/project.api.types';

export const fetchProjects = async (): Promise<Project[]> => {
  const { data } = await axiosPrivate.get<Project[]>('/projects');
  return data;
};

export const fetchProjectById = async (id: string): Promise<ProjectDetails> => {
  const { data } = await axiosPrivate.get<ProjectDetails>(`/projects/${id}`);
  return data;
};
