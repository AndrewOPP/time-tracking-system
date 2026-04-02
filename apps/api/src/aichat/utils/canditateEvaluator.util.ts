import {
  MappedAiUser,
  MATH_CONSTANTS,
  MESSAGES,
  MULTIPLIERS,
  PENALTIES,
  RawUserProject,
  SCORES,
  STATUSES,
  THRESHOLDS,
  WEIGHTS,
} from '../constants/aichat.constants';
import { EvaluateCandidatesArgs } from '../schemas/ai-validation.schema';
import { RawUser } from '../types/aichat.types';
import { capitalize } from './string';

export function calculateWeights(args: EvaluateCandidatesArgs) {
  const rawWeights = {
    skills: args.requiredSkills?.length ? WEIGHTS.SKILLS_ACTIVE : SCORES.MIN,
    availability:
      args.loadStatus === STATUSES.AVAILABLE || args.loadStatus === STATUSES.OVERLOAD
        ? WEIGHTS.AVAILABILITY_HIGH
        : WEIGHTS.AVAILABILITY_LOW,
    domain: args.targetDomain ? WEIGHTS.DOMAIN_ACTIVE : SCORES.MIN,
    risk: WEIGHTS.RISK,
  };

  const totalWeight =
    rawWeights.skills + rawWeights.availability + rawWeights.domain + rawWeights.risk;

  const weights = {
    skills: Math.round((rawWeights.skills / totalWeight) * MATH_CONSTANTS.PERCENT),
    availability: Math.round((rawWeights.availability / totalWeight) * MATH_CONSTANTS.PERCENT),
    domain: Math.round((rawWeights.domain / totalWeight) * MATH_CONSTANTS.PERCENT),
    risk: SCORES.MIN,
  };
  weights.risk = MATH_CONSTANTS.PERCENT - (weights.skills + weights.availability + weights.domain);

  return weights;
}

export function evaluateDomain(
  rawUser: RawUser & { projects?: RawUserProject[] },
  targetDomain?: string
) {
  const allProjects = rawUser.projects.map(project => {
    const readbleDomain = capitalize(project.project.domain);
    return {
      projectName: project.project.name,
      domain: readbleDomain,
    };
  });

  if (!targetDomain)
    return { score: SCORES.MIN, reasoning: MESSAGES.DOMAIN_NO_MATCH, allProjects: allProjects };

  const matchingProjects = (rawUser.projects || []).filter(
    p => p.project?.domain?.toLowerCase() === targetDomain.toLowerCase()
  );

  if (matchingProjects.length > SCORES.MIN) {
    const score =
      matchingProjects.length >= THRESHOLDS.DOMAIN_PROJECTS_HIGH
        ? SCORES.MAX
        : SCORES.DOMAIN_PARTIAL;
    const projectNames = matchingProjects
      .map(p => p.project?.name)
      .filter(Boolean)
      .join(', ');
    return {
      score,
      reasoning: `Worked on ${matchingProjects.length} ${capitalize(targetDomain)} project(s): ${projectNames}`,
      allProjects: allProjects,
    };
  }

  return { score: SCORES.MIN, reasoning: MESSAGES.DOMAIN_NO_MATCH, allProjects: allProjects };
}

export function evaluateSkills(mappedUser: MappedAiUser, requiredSkills?: string[]) {
  if (!requiredSkills || requiredSkills.length === SCORES.MIN) {
    return { score: SCORES.MAX, reasoning: MESSAGES.SKILLS_NO_REQUEST };
  }

  if (!mappedUser.skills || !Array.isArray(mappedUser.skills)) {
    return { score: SCORES.MIN, reasoning: MESSAGES.SKILLS_INSUFFICIENT };
  }

  const userSkillsLower = mappedUser.skills.map(s => s.toLowerCase());
  const matched = requiredSkills.filter(req => userSkillsLower.includes(req.toLowerCase()));
  const score = Math.round((matched.length / requiredSkills.length) * MATH_CONSTANTS.PERCENT);

  const missing = requiredSkills.filter(req => !userSkillsLower.includes(req.toLowerCase()));
  const reasoning =
    missing.length > SCORES.MIN ? `Missing: ${missing.join(', ')}` : MESSAGES.SKILLS_ALL_PRESENT;

  return { score, reasoning, matched, missing };
}

export function evaluateAvailability(mappedUser: MappedAiUser, loadStatus?: string) {
  const stats = mappedUser.aiStats;

  if (!stats || typeof stats.employedTimePercent !== 'number') {
    return {
      score: SCORES.MIN,
      displayScore: SCORES.MIN,
      reasoning: MESSAGES.AVAILABILITY_INSUFFICIENT,
    };
  }

  let baseScore = Math.max(SCORES.MIN, MATH_CONSTANTS.PERCENT - stats.employedTimePercent);
  let displayScore = baseScore;
  let monthWorkingHours = stats.monthWorkingHours;

  if (loadStatus === STATUSES.OVERLOAD) {
    baseScore = stats.employedTimePercent > THRESHOLDS.OVERLOAD_PERCENT ? SCORES.MAX : SCORES.MIN;
    displayScore = MATH_CONSTANTS.PERCENT - stats.employedTimePercent;
  } else if (mappedUser.workFormat === STATUSES.PART_TIME) {
    baseScore = Math.round(baseScore * MULTIPLIERS.PART_TIME);
    displayScore = baseScore;
    monthWorkingHours = monthWorkingHours * MULTIPLIERS.PART_TIME;
  }

  const freeEmployeeHours = Number(monthWorkingHours - stats.totalUserHours).toFixed(
    MATH_CONSTANTS.DECIMAL_PLACES
  );

  let reasoning = `${Math.max(SCORES.MIN, displayScore)}% capacity available (${Math.max(SCORES.MIN, Number(freeEmployeeHours))}h)`;
  if (loadStatus === STATUSES.OVERLOAD) {
    reasoning = `Overloaded by ${Math.abs(displayScore)}% (${Math.abs(Number(freeEmployeeHours))}h overtime needed)`;
  }

  return { score: baseScore, displayScore, reasoning };
}

export function evaluateRisk(mappedUser: MappedAiUser) {
  const stats = mappedUser.aiStats;

  if (!stats) {
    return { score: SCORES.MIN, reasoning: MESSAGES.RISK_INSUFFICIENT };
  }

  let score = SCORES.MAX;
  const risks: string[] = [];

  if (stats.employedTimePercent > THRESHOLDS.OVERLOAD_PERCENT) {
    score -= PENALTIES.OVERLOAD;
    risks.push(`Overloaded: ${stats.employedTimePercent}%, ${stats.overtime}h overtime this month`);
  } else if (stats.overtime > SCORES.MIN) {
    score -= PENALTIES.OVERTIME;
    risks.push(`Has ${stats.overtime}h overtime`);
  }

  if (stats.untracked > THRESHOLDS.UNTRACKED_HOURS) {
    score -= PENALTIES.UNTRACKED;
    risks.push(MESSAGES.RISK_HIGH_UNTRACKED);
  }

  if (mappedUser.ptoHours > SCORES.MIN) {
    score -= PENALTIES.PTO;
    risks.push(`Planned PTO: ${mappedUser.ptoHours}h`);
  }

  const reasoning = risks.length > SCORES.MIN ? risks.join(', ') : MESSAGES.RISK_LOW;
  return { score: Math.max(SCORES.MIN, score), reasoning };
}
