import { ProjectDomain, TechnologyType } from '@time-tracking-app/database/index';

// ==========================================================================
// TYPES & ENUMS
// ==========================================================================
export type AiLoadStatus = 'AVAILABLE' | 'OVERLOADED' | 'ALL';
export type AiWorkFormat = 'FULL_TIME' | 'PART_TIME' | 'ANY';
export type AiSkillFormat = 'AND' | 'OR' | '';
export type AiProjectDomain =
  | 'FINTECH'
  | 'HEALTHCARE'
  | 'E_COMMERCE'
  | 'FOODTECH'
  | 'EDTECH'
  | 'ANY';
export type AiValidationFormat = 'EMPLOYEES' | 'ALTERNATIVES' | 'PROJECT_TEAM' | 'PM_PORTFOLIO';

export type SystemRole = 'EMPLOYEE' | 'MANAGER';

export const AI_LOAD_STATUSES: AiLoadStatus[] = ['AVAILABLE', 'OVERLOADED', 'ALL'];
export const AI_WORK_FORMATS: AiWorkFormat[] = ['FULL_TIME', 'PART_TIME', 'ANY'];
export const AI_VALIDATION_FORMATS: AiValidationFormat[] = [
  'EMPLOYEES',
  'ALTERNATIVES',
  'PROJECT_TEAM',
  'PM_PORTFOLIO',
];
export const AI_SKILL_FORMATS: AiSkillFormat[] = ['AND', 'OR', ''];

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
  projectDomain?: AiProjectDomain;
  excludeNames?: string[];
  systemRole?: SystemRole;
  skillMode?: AiSkillFormat;
  minLoadPercent?: number;
  maxLoadPercent?: number;
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
  AVALIABLE_LOAD_PERCENT: 90,
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

export interface EvaluateCandidatesArgs {
  projectName: string;
  candidateNames: string[];
}

export const AI_TOOL_DESCRIPTIONS = {
  GET_TECH_BY_CATEGORY: `CRITICAL: ALWAYS call this FIRST ONLY when the user explicitly asks for developers by a SPECIFIC role only like these values: ${availableTechnologyType}. If the user just asks for general "developers" without specifying a role, DO NOT call this tool and DO NOT guess roles. It returns the exact list of skills that you can use with searchEmployees.`,

  SEARCH_EMPLOYEES: `
    Searches employees OR Project Managers (PMs). You can search by skills, workload ranges, work format, or real name. 
    
    CRITICAL WORKLOAD RULES:
    - DEFAULT WORKLOAD: If the user does not specify availability or workload, you MUST set minLoadPercent to 0 and maxLoadPercent to 1000.
    - If user asks for "available", set maxLoadPercent to 90.
    - If user asks for "overloaded", set minLoadPercent to 101, set maxLoadPercent to 1000.
    - If user asks for "> 0%" or "working", set minLoadPercent to 1 (and keep maxLoadPercent at 1000).
    - You can combine minLoadPercent and maxLoadPercent for specific ranges.
  `,

  GET_PROJECT_TEAM: 'Use ONLY when the user asks about a specific project team or project details.',

  GET_PM_PORTFOLIO:
    'Use ONLY when the user asks which projects a specific Project Manager (PM) is managing.',

  FINALIZE_AND_VALIDATE_RESPONSE: `
    ⚠️ CRITICAL: YOU MUST CALL THIS TOOL BEFORE SHOWING ANY DATA TO THE USER. 
    Once you have gathered data from 'searchEmployees', 'getProjectTeam', or 'getPmPortfolio', and selected the entities you want to display, you MUST pass them to this tool for a final database validation. 
    If this tool returns an error, you MUST correct your data and call it again.
  `,

  EVALUATE_CANDIDATES:
    'Use to evaluate candidates for a specific project. CRITICAL (TOOL CHAINING): If the user asks to FIRST find candidates (e.g., "Find 5 developers and evaluate them for project X"), you MUST follow 2 steps: STEP 1 - call searchEmployees. STEP 2 - take the names from step 1 and IMMEDIATELY call evaluateCandidates. Only respond to the user after step 2.',
};

export const AI_SCHEMA_DESCRIPTIONS = {
  GET_PROJECT_TEAM_SYS_INSTUCRION: `
    Show the project team.

    Template:
    ### **[Project Name]**
    - 📌 **Status:** [Status]
    - 👤 **PM:** [PM Name or Unassigned]
    - 🏷️ **Domain:** [Domain]
    - ⚙️ **Technologies:** [Technologies]
    - 👥 **Team Members:**
      - [Employee Name] — [Hours logged] hours logged
  `,
  GET_PM_PROJECTS_SYS_INSTUCRION: `
    Show the manager's projects.
    Provide a short reasoning about workload based on number of projects and team sizes.

    Template:
    ### **[Project Name]**
    - 📌 **Status:** [Status]
    - 🏷️ **Domain:** [Domain]
    - 👥 **Team Size:** [Team Size]
  `,
  ALTERNATIVES_SYS_INSTRUCTION:
    'No candidates were found for the requested workload. Suggest alternatives and explain they are similar specialists.',
  EMPLOYEE_SEARCH_SYS_INSTRUCTION: `
    CRITICAL (REASONING & FORMATTING RULES): Strictly follow these rules to meet HR guidelines. Use EXACT data from the 'aiStats' object for each user. Do NOT hallucinate numbers.

    (EXPLANATION): For each candidate, list matching required skills. Explicitly state Employed Time % and hours, broken down using the aiStats object.

    (AVAILABILITY): Employees with aiStats.totalPercent between 0–90% are available. Mention this when comparing candidates.

    (OVERLOAD): If aiStats.totalPercent > 100 or aiStats.overtimeHours > 0, add:
    "⚠️ [Name] is overloaded — [aiStats.totalPercent]% with [aiStats.overtimeHours]h overtime. Consider rebalancing workload."

    (NEAR LIMIT): If aiStats.totalPercent is between 91 and 100 inclusive, add:
    "⚠️ [Name] is at [aiStats.totalPercent]% — nearly at full capacity."

    (UNTRACKED TIME): If aiStats.untrackedHours > 0, add:
    "Note: [aiStats.untrackedPercent]% of this employee's time is untracked ([aiStats.untrackedHours]h). Actual workload may be higher."

    (WORK FORMAT): When comparing candidates or availability, explain differences: Part-time vs Full-time free hours.

    GENERAL TEMPLATE:
    ### **[Name]**
    - 🛠 **Skills:** [List of all users skills]
    - 💼 **Format:** [Work Format]
    - 📊 **Employed Time:** [aiStats.totalPercent]% (Total: [aiStats.totalHours]h [if billableHours > 0: | Billable: aiStats.billableHoursPercent% ([aiStats.billableHours]h)] [if nonBillableHours > 0: | Non-Billable: aiStats.nonBillableHoursPercent% ([aiStats.nonBillableHours]h)] [if untrackedHours > 0: | Untracked: aiStats.untrackedHoursPercent% ([aiStats.untrackedHours]h)])
    - [If aiStats.overtimeHours > 0 add line: 🚨 **Overtime:** [aiStats.overtimeHours]h]
    - 📁 **Active Projects:** [List] or None (Don't show this line if user asked about managers)
    - 💡 **HR Analysis:** [2-3 sentence explanation with warnings].

  `,
  TECH_CATEGORY: 'Category of tech',
  SKILLS_LIST: `
    List of required skills. 
    RULE 1: If the user asks for MULTIPLE skills, put ALL of them into a SINGLE array.
    RULE 2: Leave this array EMPTY if the user says "any".
    RULE 3: Do NOT pass broad role categories (e.g., frontend, backend, or any from ${availableTechnologyType}) directly into the "skills" search parameter. If the user requests a category, you MUST first call the "getTechnologiesByCategory" tool to retrieve the exact list of specific technologies, and then use those returned technologies for your search.
    RULE 4: ⚠️ CRITICAL: The database uses STRICT 'AND' logic. When finding a team for a project, DO NOT pass the entire project stack! Pass only 1 or 2 core skills (e.g. ["React"] OR ["Node.js"]) to avoid getting 0 results.
    RULE 5: 🚫 EXACT MATCH ONLY. Search strictly for the skills explicitly mentioned by the user. Do NOT invent, guess, hallucinate, or add related skills that the user did not directly ask for.
  `,
  EMPLOYEE_LIMIT: `The maximum number of employees to return. This value depends primarily on the users explicit request (e.g., if they ask for 10 candidates, set to 10). CRITICAL: If the user asks for a general count or quantity (e.g., "How many?"), you MUST set this limit to 50 to ensure an accurate calculation for the processedUsers out of all users report. Default is 5.`,
  REAL_NAME: 'Real name of the employee. Use this if the user asks for a specific person.',

  WORK_FORMAT: `
    OMIT this field unless the user specifically asks for FULL_TIME or PART_TIME. 
    ⚠️ CRITICAL REASONING RULE: Remember that PART_TIME employees have a baseline of 50% fewer working hours per month compared to FULL_TIME employees. You MUST account for this reduced baseline when evaluating their availability, calculating their workload percentages, or comparing their free hours to full-time staff.
  `,
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
  SKILL_MODE: `
  "OR" (default): match ANY skill.
  "AND": match ALL skills.
  Use "AND" ONLY if user explicitly requires multiple skills ("and", "must have").
  Otherwise use "OR".
`,

  PROJECT_TEAM_NAME_DESC:
    'CRITICAL: Use this tool to find out the team composition of a specific project. Enter the project name',
  PM_PORTFOLIO_MANAGER_DESC:
    'CRITICAL: Use this tool to find all projects managed by a specific Project Manager (PM)',

  EVALUATE_PROJECT_NAME_DESC: 'The name of the project to which we want to assign people',

  EVALUATE_CANDIDATES_DESC: 'An array of candidate names to evaluate (e.g., ["John", "Peter"])',

  SYSTEM_ROLE_DESC:
    'CRITICAL: If the user is looking for developers or engineers, pass "EMPLOYEE". If the user explicitly asks for a Project Manager (PM, managers), you MUST pass "MANAGER".',
  MIN_LOAD_PERCENT_DESC:
    'Minimum employed time percentage. It should be 0 by default. Use 101 if the user asks for overloaded employees.',
  MAX_LOAD_PERCENT_DESC:
    'Maximum employed time percentage. Use 90 if the user asks for available employees.',
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

export const TOOL_RETURN_STATUS = {
  NOT_FOUND: 'not_found',
  SUCCESS: 'success',
  VALIDATION_FAILED: 'validation_failed',
} as const;

export const AI_SKILL_FORMATS_OBJ = {
  AND: 'AND',
  OR: 'OR',
} as const;

export const AI_VALIDATION_FORMAT = {
  EMPLOYEES: 'EMPLOYEES',
  ALTERNATIVES: 'ALTERNATIVES',
  PROJECT_TEAM: 'PROJECT_TEAM',
  PM_PORTFOLIO: 'PM_PORTFOLIO',
} as const;

export interface GetProjectTeamArgs {
  projectName: string;
}

export interface GetPmPortfolioArgs {
  managerName: string;
}
