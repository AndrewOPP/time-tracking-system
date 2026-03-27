import { ProjectDomain, TechnologyType } from '@time-tracking-app/database/index';

// ==========================================================================
// TYPES & ENUMS
// ==========================================================================
export type AiLoadStatus = 'AVAILABLE' | 'OVERLOADED' | 'ALL';
export type AiWorkFormat = 'FULL_TIME' | 'PART_TIME' | 'ANY';
export type AiProjectDomain =
  | 'FINTECH'
  | 'HEALTHCARE'
  | 'E_COMMERCE'
  | 'FOODTECH'
  | 'EDTECH'
  | 'ANY';

export const AI_LOAD_STATUSES: AiLoadStatus[] = ['AVAILABLE', 'OVERLOADED', 'ALL'];
export const AI_WORK_FORMATS: AiWorkFormat[] = ['FULL_TIME', 'PART_TIME', 'ANY'];
export const AI_PROJECT_DOMAINS: AiProjectDomain[] = [
  'FINTECH',
  'HEALTHCARE',
  'E_COMMERCE',
  'FOODTECH',
  'EDTECH',
  'ANY',
];

export interface GetTechByCategoryArgs {
  type: TechnologyType;
}

export interface SearchEmployeesArgs {
  skills?: string[];
  limit?: number;
  realName?: string;
  workFormat?: AiWorkFormat;
  loadStatus?: AiLoadStatus;
  projectDomain?: AiProjectDomain;
  excludeNames?: string[];
}

export interface SearchProjectsArgs {
  projectName?: string;
  projectManagerName?: string;
  projectDomain?: AiProjectDomain;
}

// ==========================================================================
// CONFIGURATION
// ==========================================================================
export const AI_CONFIG = {
  MAX_HISTORY_MESSAGES: 5,
  MAX_AI_STEPS: 6,
  USERS_FETCH_LIMIT: 50,
  PROJECTS_FETCH_LIMIT: 5,
  ALTERNATIVES_FETCH_LIMIT: 3,
  DEFAULT_SEARCH_LIMIT: 5,
  PART_TIME_HOURS: 4,
  FULL_TIME_HOURS: 8,
  FULL_LOAD_PERCENT: 100,
};

// ==========================================================================
// PROMPTS & MESSAGES
// ==========================================================================

const availableDomains = Object.values(ProjectDomain).join(', ');
const availableTechnologyType = Object.values(TechnologyType).join(', ');

export const AI_PROMPTS_ADDITIONS = {
  CRITICAL_RULE:
    "\n\nCRITICAL RULE: If the user searches for an EMPLOYEE by name (e.g., \"Find Andrew\"), you MUST call 'searchEmployees' with the 'realName' parameter and NO other filters. HOWEVER, if the user explicitly asks for PROJECTS managed by someone (e.g., \"projects managed by Johan\"), you MUST use 'searchProjects' with the 'projectManagerName' parameter instead!",
};

export const AI_TOOL_DESCRIPTIONS = {
  GET_TECH_BY_CATEGORY: `CRITICAL: ALWAYS call this FIRST ONLY when the user explicitly asks for developers by a SPECIFIC role only like these values: ${availableTechnologyType}. If the user just asks for general "developers" without specifying a role, DO NOT call this tool and DO NOT guess roles. It returns the exact list of skills that you can use with searchEmployees.`,
  SEARCH_EMPLOYEES:
    'Searches employees by skills, workload, availability, OR real name. WARNING: If searching by specific name, ONLY pass realName, do NOT pass skills. If searching by one specific thing, NEVER add any more parameters',
  SEARCH_PROJECTS:
    'Searches for projects by name, Project Manager, or domain. Always give answers with PM or No PM if project has no PM',
};

export const AI_SCHEMA_DESCRIPTIONS = {
  TECH_CATEGORY: 'Category of tech',
  SKILLS_LIST:
    'List of required skills. CRITICAL: If the user asks for MULTIPLE skills (e.g., "React and Python"), you MUST put ALL of them into a SINGLE array in ONE tool call: ["React", "Python"]. DO NOT make separate tool calls for each skill.',
  EMPLOYEE_LIMIT: 'Number of employees to return. Default 5.',
  REAL_NAME: 'Real name of the employee. Use this if the user asks for a specific person.',
  LOAD_STATUS:
    'CRITICAL: Set to "ALL" by default. ONLY use "AVAILABLE" or "OVERLOADED" if the user EXPLICITLY mentioned workload or availability in the prompt.',
  WORK_FORMAT: 'OMIT this field unless the user specifically asks for FULL_TIME or PART_TIME.',
  PROJECT_DOMAIN_EMPLOYEE:
    'OMIT this field unless a specific domain (e.g. Fintech) is explicitly mentioned in the user prompt.',
  EXCLUDE_NAMES:
    'CRITICAL: If the user asks for "more" or "other" candidates, you MUST look at your previous messages, take the exact names of the employees you ALREADY showed them, and pass them in this array to exclude them from the new search.',
  PROJECT_NAME:
    'Name of the project. DO NOT split names with commas, hyphens, or "and". "Rolfson, Jones and Fahey" is ONE full project name. NEVER extract a manager name from it. If the user asks for all projects, you MUST OMIT this parameter entirely.',
  PROJECT_MANAGER_NAME:
    'Name of the PM. OMIT THIS FIELD ENTIRELY unless the user explicitly asks for a Project Manager (e.g., "managed by Johan").',
  PROJECT_DOMAIN_PROJECT: `
    Project domain.

    STRICT RULES:
    - CRITICAL: You MUST use one of these exact values: ${availableDomains}. You cant use any of these values for other tools. It will be an error.
    - NEVER guess the domain.
    - NEVER default to any domain.
    - Example of WRONG behavior:
      User: "Find project Blanda - Welch"
      ❌ { projectName: "Blanda - Welch", projectDomain: "E_COMMERCE" }
      ✅ { projectName: "Blanda - Welch" }

      User: "Tell me Olin Braun projects"
      ❌ { projectManagerName: "Olin Braun", projectDomain: "E_COMMERCE" }
      ✅ { projectManagerName: "Olin Braun" }
    `,
};

export const AI_MESSAGES = {
  UNASSIGNED_PM: 'Unassigned',
  NO_SKILLS: 'No skills listed',
  DB_ERROR_USERS: 'Database is currently unavailable.',
  NO_PROJECTS_FOUND: 'No projects found.',
  PROJECT_DATA_ERROR: 'Could not retrieve project data.',
  EXACT_MATCH_NOT_FOUND: 'Exact match not found. Showing alternative available employees.',
};

export const AI_LOAD_STATUS = {
  AVAILABLE: 'AVAILABLE',
  OVERLOADED: 'OVERLOADED',
  ALL: 'ALL',
} as const;

export const AI_WORK_FORMAT = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  ANY: 'ANY',
} as const;

export const AI_PROJECT_DOMAIN = {
  FINTECH: 'FINTECH',
  HEALTHCARE: 'HEALTHCARE',
  E_COMMERCE: 'E_COMMERCE',
  FOODTECH: 'FOODTECH',
  EDTECH: 'EDTECH',
  ANY: 'ANY',
} as const;

export const USER_SYSTEM_ROLE = {
  EMPLOYEE: 'EMPLOYEE',
  MANAGER: 'MANAGER',
  HR: 'HR',
  ACCOUNTANT: 'ACCOUNTANT',
  ADMIN: 'ADMIN',
} as const;

export const PROJECT_STATUS = {
  ACTIVE: 'ACTIVE',
} as const;
