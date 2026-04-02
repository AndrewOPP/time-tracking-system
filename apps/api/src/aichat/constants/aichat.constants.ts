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

export const AI_PROMPTS_ADDITIONS = {
  CRITICAL_RULE: `CRITICAL: If searching for an EMPLOYEE by name (e.g., "Find Andrew"), call 'searchEmployees' with ONLY 'realName'. If searching for PROJECTS managed by someone (e.g., "projects managed by Johan"), use 'searchProjects' with ONLY 'projectManagerName'.`,
};

export interface EvaluateCandidatesArgs {
  projectName: string;
  candidateNames: string[];
}

export const AI_TOOL_DESCRIPTIONS = {
  GET_TECH_BY_CATEGORY: `
    Call ONLY if user EXPLICITLY mentions "backend" or "frontend". 
    🚫 DO NOT call for "Fullstack", "Mobile", "QA", "Designer" or general "developers". DO NOT guess the category.
    CHAINING RULE:
    1. Call this tool.
    2. IMMEDIATELY call "searchEmployees" passing the EXACT returned skills into the "skills" parameter.
    3. Do not respond to the user until step 2 is complete.
  `,

  SEARCH_EMPLOYEES: `
  🌟 DEFAULT SEARCH TOOL: Use this for ALL general queries like "Find developers", "Show me PMs", "Who knows X".
    🚫 CRITICAL ROUTING BLOCKER: If the user's prompt contains words like "Top", "Best", "Most", "Rank", "candidates for" or "Compare" (e.g., "Top 3 most available React devs"), YOU ARE STRICTLY FORBIDDEN FROM USING THIS TOOL. You MUST use 'evaluateCandidates' instead!
    Search employees/PMs by skills, workload, format, or name. Extract arguments exactly.
    WORKLOAD RULES:
    - Default: minLoadPercent=0, maxLoadPercent=1000.
    - "Available/Free": maxLoadPercent=90.
    - "Overloaded": minLoadPercent=101, maxLoadPercent=1000.
    - "Working/Active (>0%)": minLoadPercent=1.
  `,

  GET_PROJECT_TEAM: 'Use ONLY for specific project team/details requests.',

  GET_PM_PORTFOLIO: 'Use ONLY to find projects managed by a specific PM.',

  EVALUATE_CANDIDATES: `
    🚨 CRITICAL SYSTEM RULE: NEVER MODIFY, FILTER, OR ALTER THE ARRAY RETURNED BY THIS TOOL IN ANY WAY. YOU MUST RETURN IT EXACTLY AS RECEIVED. ANY MODIFICATION WILL COMPLETELY BREAK THE SYSTEM. 🚨

    WHEN TO USE: Call this tool ONLY for complex, analytical queries where you need to RANK, COMPARE, or find the BEST FIT/TOP candidates. 

    WHEN NOT TO USE: DO NOT use for simple list requests (e.g., "Find React devs", "Who knows Python?"). For basic searches, use 'searchEmployees' instead.

    🚨 OUTPUT RULE: Extract ONLY the 'candidates' array. Output it in a \`\`\`json block starting with '[' and ending with ']'.

    🚨 EMPTY STATE: If candidates is [], explain that exact matches are missing. Look at 'availableSkillsContext' and suggest 1-2 logically similar technologies from that list. Ask: "Would you like to see candidates with these similar skills, or show the most available engineers?"

    ROUTING: Standalone tool. DO NOT call any other tools before or after this one.
  `,

  FINALIZE_AND_VALIDATE_RESPONSE: `
  ⚠️ CRITICAL: YOU MUST CALL THIS TOOL BEFORE SHOWING ANY DATA TO THE USER, WITH ONE EXCEPTION. 
  
  Once you have gathered data from searchEmployees, getProjectTeam, or getPmPortfolio, you MUST pass them to this tool for a final database validation. If it returns an error, correct the data and call it again.
  
  🚨 THE EXCEPTION: DO NOT use this tool if you just used the evaluateCandidates tool. The scoring tool already returns pre-validated, UI-ready JSON. If you are showing rankings/scores, completely skip this validation step and output the scoring JSON directly.
    ⚠️ CRITICAL: MUST CALL BEFORE SHOWING DATA. 
    Pass selected entities from 'searchEmployees', 'getProjectTeam', or 'getPmPortfolio' for validation. If error, correct data and recall.
  `,
};

export const AI_SCHEMA_DESCRIPTIONS = {
  GET_PROJECT_TEAM_SYS_INSTUCRION: `
    Template:
    ### **[Project Name]**
    - 📌 **Status:** [Status]
    - 👤 **PM:** [PM Name or Unassigned]
    - 🏷️ **Domain:** [Domain]
    - ⌛  **Start date:** [startDate.split("T")[0]]
    - ⚙️ **Technologies:** [Technologies]
    - 👥 **Team Members:**
      - [Employee Name] — [Hours logged] hours logged
  `,
  GET_PM_PROJECTS_SYS_INSTUCRION: `
    Include short reasoning about workload based on projects/team size.
    Template:
    ### **[Project Name]**
    - 📌 **Status:** [status]
    - 🏷️ **Domain:** [domain]
    - 👥 **Team Size:** [totalTeamMembers]
    - 🕒 **Total Project Hours (Month):** [totalProjectHoursThisMonth]h
    - 🔨 **Team Breakdown:**
      * [teamMembers.name] ([teamMembers.position]) — [teamMembers.perProjectTotalHours]h
  `,
  ALTERNATIVES_SYS_INSTRUCTION:
    'No candidates found for requested workload. Suggest these alternatives as similar specialists.',

  EMPLOYEE_SEARCH_SYS_INSTRUCTION: `
    Extract arguments EXACTLY. Do not hallucinate numbers or any other arguments. Use EXACT 'aiStats' and other data returned from the tool.
    
    RULES:
    - State matching required skills.
    - Use skills from user request or you getTechnologiesByCategory.
    - Account for Part-time vs Full-time differences.
    - ZERO-VALUE: Output all fields exactly as below, even if 0.
    - Availability: If totalPercent is below 90%, the employee is considered fully available.
    - ⚖️ CAPACITY COMPARISON: When ranking availability between multiple people, explicitly state that Full-Time provides more absolute free hours than Part-Time at the same load percentage.
    📊 COUNT QUERIES: If asking "How many...". Add to your response with: "[totalAvailable] out of [totalOverall] total". ⚠️ CRITICAL: You MUST extract and pass the required skill into the 'skills' array (e.g., ["Python"]).
    
    ⚠️ MANDATORY WARNINGS CHECKLIST (EVALUATE STEP-BY-STEP FOR EACH EMPLOYEE):
    You MUST check ALL 3 conditions below independently. If a condition is true, you MUST output its corresponding text in the "⚠️ Warnings:" section. It is strictly required to show ALL warnings that apply.
    
    [STEP 1] Check Overload: Is totalPercent >= 100 OR overtime > 0?
             -> If YES, add: "[Name] is overloaded — [aiStats.employedTimePercent]% with [aiStats.overtime]h overtime. Consider rebalancing workload."
    [STEP 2] Check Near Limit: Is totalPercent >= 90 AND totalPercent <= 99?
             -> If YES, add: "[Name] is at [aiStats.employedTimePercent]% — nearly at full capacity."
    [STEP 3] Check Untracked: Is untracked > 0?
             -> If YES, add: "Note: [aiStats.untrackedPercent]% of time is untracked ([aiStats.untracked]h). Actual workload may be higher."

    TEMPLATE:
    ### **[Name]**
    - 🛠 **Skills:** [List of all users skills]
    - 💼 **Format:** [Work Format]
    - ⚠️ **Warnings:** (Add this section ONLY if at least one STEP above is YES)
      - [Result of STEP 1 if YES]
      - [Result of STEP 2 if YES]
      - [Result of STEP 3 if YES]
    - ⛵ **PTO:** [ptoHours]h
    - 📊 **Employed Time:** [aiStats.employedTimePercent]% (Total: [aiStats.totalUserHours]h | Billable: [aiStats.billableHoursPercent]% ([aiStats.billableHours]h) | Non-Billable: [aiStats.nonBillableHoursPercent]% ([aiStats.nonBillableHours]h) | Untracked: [aiStats.untrackedHoursPercent]% ([aiStats.untracked]h))
    - [If overtime > 0: 🚨 **Overtime:** [aiStats.overtime]h]
    - 📁 **Active Projects:**
      * [Project Name] (PM: [PM Name]) - [hoursSpent]h
      (If none: "None")
    - 💡 **HR Analysis:** [2-3 sentence HR evaluation/warnings].
  `,
  TECH_CATEGORY: 'MUST be exactly "BACKEND" or "FRONTEND". No other values.',
  SKILLS_LIST: `
    RULES:
    1. Multiple skills: put in ONE array.
    2. "Any" skills: empty array.
    3. Broad category ("frontend devs"): use getTechnologiesByCategory. Specific skills ("React"): skip tool, use searchEmployees directly.
    4. Exact match ONLY. Extract exactly as requested/returned by getTechnologiesByCategory tool.
    ⚠️ CRITICAL: If the user mentions a specific technology in their prompt (even in "How many [Skill] developers" queries), you MUST include it here.
  `,
  EMPLOYEE_LIMIT:
    'Max employees to return. Default 5. If user asks "How many?" or general count, set to 50.',
  REAL_NAME: 'Real name of the employee.',
  WORK_FORMAT:
    'OMIT unless specified. ⚠️ Remember: PART_TIME has 50% fewer baseline hours than FULL_TIME. Adjust calculations/comparisons accordingly.',
  PROJECT_DOMAIN_EMPLOYEE: 'OMIT unless a specific domain is explicitly mentioned.',
  EXCLUDE_NAMES:
    'Pass names of employees ALREADY shown in chat history if user asks for "more/other".',
  PROJECT_NAME:
    'Full project name. Do not split names. Do not extract manager names from it. OMIT if asking for all projects.',
  PROJECT_MANAGER_NAME: 'PM Name. OMIT entirely unless user explicitly asks for a PM.',
  PROJECT_DOMAIN_PROJECT: `Project domain. MUST be one of: ${availableDomains}. NEVER guess or default. OMIT if not specified.`,
  SKILL_MODE:
    '"OR" (default, match ANY, use is always after getTechnologiesByCategory). "AND" (match ALL - use ONLY if user explicitly requires "must have" or "and").',
  PROJECT_TEAM_NAME_DESC: 'Project name to find team composition.',
  PM_PORTFOLIO_MANAGER_DESC: 'PM name to find all their managed projects.',
  EVALUATE_PROJECT_NAME_DESC: 'Project name for candidate assignment.',
  SYSTEM_ROLE_DESC: 'Pass "EMPLOYEE" for devs/engineers. Pass "MANAGER" for PMs.',
  MIN_LOAD_PERCENT_DESC:
    'Min employed time %. Default 0. ⚠️ If user asks for "overloaded", set to 101. Preserve this value strictly.',
  MAX_LOAD_PERCENT_DESC:
    'Max workload %. ⚠️ "Available/Free" = 90. Otherwise = 1000. 🔒 PERSISTENCE: Maintain this intent across chained tool calls.',
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

export const SCORES = {
  MAX: 100,
  MIN: 0,
  DOMAIN_PARTIAL: 70,
};

export const WEIGHTS = {
  SKILLS_ACTIVE: 0.35,
  AVAILABILITY_HIGH: 0.5,
  AVAILABILITY_LOW: 0.3,
  DOMAIN_ACTIVE: 0.2,
  RISK: 0.15,
};

export const THRESHOLDS = {
  DOMAIN_PROJECTS_HIGH: 2,
  OVERLOAD_PERCENT: 100,
  UNTRACKED_HOURS: 35,
};

export const MULTIPLIERS = {
  PART_TIME: 0.5,
};

export const MATH_CONSTANTS = {
  PERCENT: 100,
  DECIMAL_PLACES: 1,
};

export const PENALTIES = {
  OVERLOAD: 30,
  OVERTIME: 20,
  UNTRACKED: 25,
  PTO: 20,
};

export const STATUSES = {
  AVAILABLE: 'available',
  OVERLOAD: 'overload',
  PART_TIME: 'PART_TIME',
};

export const MESSAGES = {
  DOMAIN_NO_MATCH: 'No matching domain experience',
  SKILLS_NO_REQUEST: 'No specific skills requested',
  SKILLS_INSUFFICIENT: 'Insufficient data (skills unknown)',
  SKILLS_ALL_PRESENT: 'All required skills present',
  AVAILABILITY_INSUFFICIENT: 'Insufficient data for capacity evaluation',
  RISK_INSUFFICIENT: 'Insufficient data to evaluate risk factors',
  RISK_LOW: 'Low risk',
  RISK_HIGH_UNTRACKED: 'High untracked hours',
};

export interface MappedAiUserStats {
  employedTimePercent: number;
  monthWorkingHours: number;
  totalUserHours: number;
  overtime: number;
  untracked: number;
}

export interface MappedAiUser {
  name: string;
  workFormat: string;
  ptoHours: number;
  skills: string[];
  aiStats?: MappedAiUserStats;
}

export interface RawUserProject {
  project: {
    name?: string;
    domain?: string;
  };
}
