export interface ProjectMin {
  name: string;
}

export interface TimeLog {
  id: string;
  date: string;
  hours: number;
  description: string;
  projectId: string;
  project: ProjectMin;
}

export interface CreateLog {
  date: string;
  hours: number;
  description: string;
  projectId: string;
}

export interface UpdateLog {
  hours?: number;
  description?: string;
  projectId?: string;
}

export interface DayGroup {
  fullDate: string;
  dayName: string;
  dateStr: string;
  totalHours: number;
  entries: TimeLog[];
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

export interface LogSummary {
  date: Date;
  totalHours: number;
}

export const DialogType = {
  TRACK_TIME: 'TRACK_TIME',
  DELETE_TIME_LOG: 'DELETE_TIME_LOG',
} as const;

export type DialogType = (typeof DialogType)[keyof typeof DialogType] | null;

export interface DialogData {
  date?: string | null;
  log?: TimeLog;
}

export interface DialogState {
  activeDialog: DialogType;
  dialogData: DialogData;
  openDialog: (type: DialogType, data?: DialogData) => void;
  closeDialog: () => void;
}
