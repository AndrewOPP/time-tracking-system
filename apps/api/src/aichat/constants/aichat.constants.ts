// ==========================================================================
// CONFIGURATION & LIMITS
// ==========================================================================
export const AI_CHAT_CONFIG = {
  MAX_HISTORY_MESSAGES: 4,
  STEP_COUNT_LIMIT: 6,
  DEFAULT_RESULTS_LIMIT: 5,
  MAX_DB_TAKE: 50,
  ALTERNATIVES_TAKE: 3,
};

export const AI_CHAT_THRESHOLDS = {
  MAX_CAPACITY_PERCENT: 100,
  PART_TIME_HOURS: 4,
  FULL_TIME_HOURS: 8,
};

// ==========================================================================
// STRING CONSTANTS (Grouped by domain)
// ==========================================================================

export const AI_CHAT_ERRORS = {
  DB_UNAVAILABLE: 'Database is currently unavailable.',
  PROJECTS_UNAVAILABLE: 'Could not retrieve project data.',
};

export const AI_CHAT_FALLBACKS = {
  UNASSIGNED_PM: 'Unassigned',
  NO_SKILLS: 'No skills listed',
  NO_PROJECTS: 'No projects found.',
  ALTERNATIVES_MSG: 'Exact match not found. Showing alternative available employees.',
};

export const AI_CHAT_DB_VALUES = {
  ROLE_EMPLOYEE: 'EMPLOYEE',
  STATUS_ACTIVE: 'ACTIVE',
  MODE_INSENSITIVE: 'insensitive' as const,
};

export const AI_CHAT_LOAD_STATUSES = {
  AVAILABLE: 'AVAILABLE',
  OVERLOADED: 'OVERLOADED',
};

// ==========================================================================
// PROMPTS & DESCRIPTIONS
// ==========================================================================

export const AI_PROMPTS = {
  CRITICAL_NAME_RULE: `CRITICAL RULE: If the user asks about a specific person by name (e.g., "Andrew"), you MUST call 'searchEmployees' with the 'realName' parameter. DO NOT pass any other filters like 'skills' or 'loadStatus' when searching by name!`,
};

export const TOOL_DESCRIPTIONS = {
  GET_TECH:
    'CRITICAL: ALWAYS call this FIRST when the user asks for developers by role (e.g., "backend", "frontend", "design"). It returns the exact list of skills that you MUST pass into searchEmployees.',

  SEARCH_EMPLOYEES:
    'Searches employees by skills, workload, availability, OR real name. WARNING: If searching by specific name, ONLY pass realName, do NOT pass skills.',
  SEARCH_PROJECTS: 'Searches for projects by name, Project Manager, or domain.',
};
