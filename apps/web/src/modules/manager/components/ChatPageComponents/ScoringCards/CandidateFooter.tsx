import { Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip';
import { getRisk } from '@/modules/manager/utils/scoring';
import type { ScoringCandidate } from '@/modules/manager/types/managerAIChat.types';

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

      {candidate.projects && (
        <Tooltip>
          <TooltipTrigger>
            <div className="text-xs font-medium text-slate-600 hover:text-slate-900 underline decoration-dashed underline-offset-4 transition-colors">
              Projects ({candidate.projects.length})
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px] text-xs">
            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
              {candidate.projects.length > 0 ? (
                <>
                  {candidate.projects.map((project, idx) => (
                    <div key={idx} className="flex flex-col gap-0.5">
                      <span className="font-medium text-slate-200">{project.projectName}</span>
                      {project.domain && (
                        <span className="text-slate-400 text-[10px]">Domain: {project.domain}</span>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-slate-200 text-xs">No projects available.</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
