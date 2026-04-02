import { CardContent } from '@components/ui';
import { CandidateHeader } from './CandidateHeader';
import { CandidateCriteria } from './CandidateCriteria';
import { CandidateFooter } from './CandidateFooter';
import type { ScoringCandidate } from '../ScoringCards';

interface CandidateCardProps {
  candidate: ScoringCandidate;
  index: number;
}

export const CandidateCard = ({ candidate, index }: CandidateCardProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 transition-all bg-white">
      <CardContent className="p-5">
        <CandidateHeader candidate={candidate} index={index} />
        <CandidateCriteria candidate={candidate} />
        <CandidateFooter candidate={candidate} />
      </CardContent>
    </div>
  );
};
