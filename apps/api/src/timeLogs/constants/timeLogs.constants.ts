// I will move that config for error to the frontend in the future.

export const TIME_LOG_ERRORS = {
  PROJECT: {
    NOT_FOUND: 'Project not found',
    ACCESS_DENIED: 'You are not a member of this project and cannot track time here',
    ACCESS_DENIED_UPDATE: 'You are not a member of this project and cannot add time to it',
  },
  LOG: {
    NOT_FOUND: 'Time log entry not found',
    LOG_IS_EXISTING:
      'A time log already exists for this project on the selected date. Please edit the existing log instead.',
    FORBIDDEN_EDIT: 'You can only edit your own time logs',
    FORBIDDEN_DELETE: 'You can only delete your own time logs',
    FORBIDDEN_BULK: 'Attempt to update a non-existent log or a log belonging to another user',
    LIMIT_EXCEEDED: (total: number) =>
      `Time limit exceeded. Total is ${total} hours (maximum 24 hours per day).`,
    LIMIT_EXCEEDED_DATE: (date: string, total: number) =>
      `Time limit exceeded for ${date}. Total is ${total} hours.`,
  },
  USER: {
    NOT_FOUND: 'Employee not found',
  },
  MESSAGES: {
    BULK_SUCCESS: 'Hours successfully saved',
    BULK_EMPTY: 'No data to save',
  },
};

export const ProjectStatus = {
  COMPLETED: 'COMPLETED',
  IN_PROGRESS: 'IN_PROGRESS',
  NOT_STARTED: 'NOT_STARTED',
  PAUSED: 'PAUSED',
} as const;

export const TIMELOGS_QUERIES_CONFIG = {
  limit: 15,
  weekNumberRange: 5,
};

export const PROJECT_TYPE = {
  billable: 'BILLABLE',
  nonBillable: 'NON_BILLABLE',
} as const;
export type ProjectTypeValue = (typeof PROJECT_TYPE)[keyof typeof PROJECT_TYPE];
