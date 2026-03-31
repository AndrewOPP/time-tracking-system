// ScoringCards.tsx

export interface ScoringCriterion {
  score: number;
  reasoning: string;
}

export interface ScoringCandidate {
  name: string;
  totalScore: number;
  criteria: {
    skillsMatch: ScoringCriterion;
    availability: ScoringCriterion;
    domainExperience: ScoringCriterion;
    riskLevel: ScoringCriterion;
  };
}

interface ScoringCardsProps {
  candidates: ScoringCandidate[];
}

const formatKeyName = (key: string) => {
  const result = key.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export function ScoringCards({ candidates }: ScoringCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5 w-full">
      {candidates.map((candidate, idx) => (
        <div
          key={idx}
          className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
        >
          <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
            <h4 className="font-bold text-base text-slate-800 truncate pr-2">{candidate.name}</h4>
            <div className="flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1 rounded-full shrink-0">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500">
                Score
              </span>
              <span className="font-bold text-sm text-indigo-700">{candidate.totalScore}/100</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 flex-grow">
            {Object.entries(candidate.criteria).map(([key, value]) => {
              const criterion = value as ScoringCriterion;
              const scoreColor =
                criterion.score >= 80
                  ? 'text-emerald-600'
                  : criterion.score >= 50
                    ? 'text-amber-500'
                    : 'text-rose-500';

              return (
                <div key={key} className="bg-slate-50 rounded p-2 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-1 gap-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide leading-tight">
                      {formatKeyName(key)}
                    </span>
                    <span className={`font-bold text-xs ${scoreColor}`}>{criterion.score}</span>
                  </div>
                  <p
                    className="text-[11px] text-slate-600 leading-snug line-clamp-3"
                    title={criterion.reasoning}
                  >
                    {criterion.reasoning}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
