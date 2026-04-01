import { CardContent } from '@components/ui';
import { Progress } from '@components/ui/progress';
import { Badge } from '@components/ui';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import { Trophy, AlertCircle, ShieldCheck, AlertOctagon, Clock } from 'lucide-react';

export interface ScoringCandidate {
  name: string;
  totalScore: number;
  skills?: string[];
  projects?: { name: string; domain: string }[];
  employedTime?: { total: number; format: string };
  criteria: {
    skillsMatch: { score: number; reasoning: string };
    availability: { score: number; reasoning: string };
    domainExperience: { score: number; reasoning: string };
    riskLevel: { score: number; reasoning: string };
  };
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 50) return 'text-amber-500';
  return 'text-rose-500';
};

const getBarColor = (score: number) => {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
};

const getRisk = (score: number) => {
  if (score >= 80)
    return { label: 'Low', color: 'bg-emerald-100 text-emerald-700', icon: ShieldCheck };
  if (score >= 50)
    return { label: 'Medium', color: 'bg-amber-100 text-amber-700', icon: AlertCircle };
  return { label: 'High', color: 'bg-rose-100 text-rose-700', icon: AlertOctagon };
};

export const ScoringCards = ({ candidates }: { candidates: ScoringCandidate[] }) => {
  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto my-6">
      {candidates.map((c, i) => {
        const risk = getRisk(c.criteria.riskLevel.score);
        const RiskIcon = risk.icon;
        console.log(candidates, 'candidates');

        return (
          <div
            key={c.name}
            className="rounded-2xl border border-slate-200  transition-all bg-white"
          >
            <CardContent className="p-5">
              {/* HEADER */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100">
                    {i === 0 ? (
                      <Trophy className="w-5 h-5 text-amber-500" />
                    ) : (
                      <span className="font-bold text-slate-600">#{i + 1}</span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 text-base">{c.name}</h3>
                    {c.employedTime && (
                      <span className="text-xs text-slate-500">{c.employedTime.format}</span>
                    )}
                  </div>
                </div>

                <div className={`text-3xl font-extrabold ${getScoreColor(c.totalScore)}`}>
                  {c.totalScore}
                  <span className="text-sm text-slate-400">/100</span>
                </div>
              </div>

              {/* CRITERIA */}
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                {[
                  { key: 'skillsMatch', label: 'Skills' },
                  { key: 'availability', label: 'Availability' },
                  { key: 'domainExperience', label: 'Domain' },
                ].map(item => {
                  const data = c.criteria[item.key as keyof typeof c.criteria];

                  console.log(c.skills, 'c.skills');
                  return (
                    <div key={item.key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">{item.label}</span>
                        <span className={getScoreColor(data.score)}>{data.score}%</span>
                      </div>

                      <Progress value={data.score} className={`h-2 ${getBarColor(data.score)}`} />
                    </div>
                  );
                })}
              </div>

              {/* SKILLS */}
              {c.skills && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {c.skills.map(skill => (
                    <Badge key={skill} className="bg-slate-100 text-slate-700 text-xs px-2 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}

              {/* FOOTER */}
              <div className="flex justify-between items-center pt-3 border-t">
                <div className="flex items-center gap-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded ${risk.color}`}>
                          <RiskIcon className="w-4 h-4" />
                          <span className="text-xs font-semibold">{risk.label} risk</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>{c.criteria.riskLevel.reasoning}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {c.employedTime && (
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Clock className="w-4 h-4" />
                      {c.employedTime.total}%
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </div>
        );
      })}
    </div>
  );
};
