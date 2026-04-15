import { TooltipProvider } from '@components/ui/tooltip';
import { CandidateCard } from './ScoringCards/CandidateCard';
import type { ScoringCandidate } from '../../types/managerAIChat.types';
import { ScoringEmptyState } from './ScoringCards/ScoringEmptyState';

interface ScoringCardsProps {
  candidates: ScoringCandidate[];
}

export const ScoringCards = ({ candidates }: ScoringCardsProps) => {
  if (!candidates || candidates.length === 0) {
    return <ScoringEmptyState />;
  }

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto my-6">
      <TooltipProvider delayDuration={200}>
        {candidates.map((c, i) => (
          <div
            key={c.name}
            className="animate-in fade-in duration-500 ease-out"
            style={{
              animationDelay: `${i * 100}ms`,
              animationFillMode: 'backwards',
            }}
          >
            <CandidateCard candidate={c} index={i} />
          </div>
        ))}
      </TooltipProvider>
    </div>
  );
};
