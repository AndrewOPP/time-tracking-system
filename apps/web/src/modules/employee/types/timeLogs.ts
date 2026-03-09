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
