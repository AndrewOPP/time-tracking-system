import { Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip';
import type { ScoringCandidate } from '../ScoringCards';
import { getRisk } from '@/modules/manager/utils/scoring';

export const CandidateFooter = ({ candidate }: { candidate: ScoringCandidate }) => {
  const risk = getRisk(candidate.criteria.riskLevel.score);
  const RiskIcon = risk.icon;

  return (
    <div className="flex justify-between items-center pt-3 border-t">
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger>
            <div className={`flex items-center gap-1 px-2 py-1 rounded ${risk.color}`}>
              <RiskIcon className="w-4 h-4" />
              <span className="text-xs font-semibold">{risk.label} risk</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[250px] text-xs">
            <div className="font-semibold mb-1 text-slate-400">
              Weight: {Math.round(candidate.appliedWeights.risk)}%
            </div>
            {candidate.criteria.riskLevel.reasoning}
          </TooltipContent>
        </Tooltip>

        {candidate.employedTime && (
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Clock className="w-4 h-4" />
            {candidate.employedTime.total}%
          </div>
        )}
      </div>
    </div>
  );
};
