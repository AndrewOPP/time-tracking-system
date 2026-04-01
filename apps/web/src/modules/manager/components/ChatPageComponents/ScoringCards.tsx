import { TooltipProvider } from '@components/ui/tooltip';
import { CandidateCard } from './ScoringCards/CandidateCard';

export interface ScoringCandidate {
  name: string;
  totalScore: number;
  skills?: string[];
  workFormat: string;
  projects?: { name: string; domain: string }[];
  employedTime?: { total: number; format: string };
  appliedWeights: {
    skills: number;
    availability: number;
    domain: number;
    risk: number;
  };
  criteria: {
    skillsMatch: { score: number; reasoning: string };
    availability: { score: number; reasoning: string };
    domainExperience: { score: number; reasoning: string };
    riskLevel: { score: number; reasoning: string };
  };
}

interface ScoringCardsProps {
  candidates: ScoringCandidate[];
}

export const ScoringCards = ({ candidates }: ScoringCardsProps) => {
  if (!candidates || candidates.length === 0) return null;

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto my-6">
      <TooltipProvider delayDuration={200}>
        {candidates.map((c, i) => (
          <CandidateCard key={c.name} candidate={c} index={i} />
        ))}
      </TooltipProvider>
    </div>
  );
};
