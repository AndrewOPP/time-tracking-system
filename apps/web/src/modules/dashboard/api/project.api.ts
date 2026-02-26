import { axiosPrivate } from '@/shared/api';
import type { Project, ProjectDetails } from '../types/project.api.types';
import { extractApiError } from '@/shared/utils/extractApiError';

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const { data } = await axiosPrivate.get<Project[]>('/projects');
    return data;
  } catch (err: unknown) {
    throw new Error(extractApiError(err, 'PROJECT_LIST_FETCH_FAILED'));
  }
};

export const fetchProjectById = async (id: string): Promise<ProjectDetails> => {
  try {
    const { data } = await axiosPrivate.get<ProjectDetails>(`/projects/${id}`);
    return data;
  } catch (err: unknown) {
    throw new Error(extractApiError(err, 'PROJECT_DETAILS_FETCH_FAILED'));
  }
};
