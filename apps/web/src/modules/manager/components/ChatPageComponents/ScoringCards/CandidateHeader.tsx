import { Trophy } from 'lucide-react';
import { getScoreColor } from '@/modules/manager/utils/scoring';
import type { ScoringCandidate } from '@/modules/manager/types/managerAIChat.types';

interface CandidateHeaderProps {
  candidate: ScoringCandidate;
  index: number;
}

export const CandidateHeader = ({ candidate, index }: CandidateHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100">
          {index === 0 ? (
            <Trophy className="w-5 h-5 text-amber-500" />
          ) : (
            <span className="font-bold text-slate-600">#{index + 1}</span>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 text-base">{candidate.name}</h3>
          <span className="text-[13px]">{candidate.workFormat}</span>
          {candidate.employedTime && (
            <span className="text-xs text-slate-500 block">{candidate.employedTime.format}</span>
          )}
        </div>
      </div>

      <div className={`text-3xl font-extrabold ${getScoreColor(candidate.totalScore)}`}>
        {candidate.totalScore}
        <span className="text-sm text-slate-400">/100</span>
      </div>
    </div>
  );
};
