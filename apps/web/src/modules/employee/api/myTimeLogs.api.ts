import { axiosPrivate } from '@/shared/api';
import type { TimeLog, UpdateLog } from '../types/timeLogs';

export const findLogsByPeriod = async (from: string, to: string): Promise<TimeLog[]> => {
  const { data } = await axiosPrivate.get<TimeLog[]>('/time-logs/me', {
    params: { from, to },
  });
  return data;
};

export const logUpdate = async (log: { id: string; updateLog: UpdateLog }): Promise<TimeLog> => {
  const { data } = await axiosPrivate.patch<TimeLog>(`/time-logs/${log.id}`, { ...log.updateLog });
  return data;
};

export const logDelete = async (log: { id: string }): Promise<TimeLog> => {
  const { data } = await axiosPrivate.delete<TimeLog>(`/time-logs/${log.id}`);
  return data;
};
