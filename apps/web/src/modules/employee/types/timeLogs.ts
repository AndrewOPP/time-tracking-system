export interface ProjectMin {
  name: string;
}

export interface TimeLog {
  id: string;
  date: string;
  hours: number; // Тут вже перетворені з рядка числа
  description: string;
  projectId: string;
  project: ProjectMin;
}

export interface UpdateLog {
  hours?: number;
  description?: string;
  projectId?: string;
}

export interface DayGroup {
  fullDate: string; // '2026-03-01'
  dayName: string; // 'Sunday'
  dateStr: string; // 'Mar 1'
  totalHours: number; // 8.5
  entries: TimeLog[]; // Array of logs for this day
}
