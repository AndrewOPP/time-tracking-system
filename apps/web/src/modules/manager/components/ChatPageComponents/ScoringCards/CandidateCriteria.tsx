import React from 'react';
import { CandidateProgressBar } from './CandidateProgressBar';
import type { ScoringCandidate } from '@/modules/manager/types/managerAIChat.types';

export const CandidateCriteria = ({ candidate }: { candidate: ScoringCandidate }) => {
  const criteriaItems = [
    { key: 'skillsMatch', weightKey: 'skills', label: 'Skills' },
    { key: 'availability', weightKey: 'availability', label: 'Availability' },
    { key: 'domainExperience', weightKey: 'domain', label: 'Domain' },
  ] as const;

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-4">
      {criteriaItems.map(item => {
        const data = candidate?.criteria?.[item.key] || {};
        const weight = candidate?.appliedWeights?.[item.weightKey] || 0;

        let tooltipContent: React.ReactNode = data.reasoning || 'No data';

        if (item.key === 'skillsMatch') {
          const skillsData = candidate?.criteria?.skillsMatch;

          if (skillsData?.matched?.length || skillsData?.missing?.length) {
            tooltipContent = (
              <div className="flex flex-col gap-1.5">
                {skillsData.matched && skillsData.matched.length > 0 && (
                  <div>
                    <span className="font-semibold text-green-400">Matched: </span>
                    <span>
                      {Array.isArray(skillsData.matched)
                        ? skillsData.matched.join(', ')
                        : String(skillsData.matched)}
                    </span>
                  </div>
                )}
                {skillsData.missing && skillsData.missing.length > 0 && (
                  <div>
                    <span className="font-semibold text-red-400">Missing: </span>
                    <span>
                      {Array.isArray(skillsData.missing)
                        ? skillsData.missing.join(', ')
                        : String(skillsData.missing)}
                    </span>
                  </div>
                )}
              </div>
            );
          }
        }

        return (
          <CandidateProgressBar
            key={item.key}
            label={item.label}
            score={data.score ?? 0}
            reasoning={tooltipContent}
            weight={weight}
            overtimePercent={candidate?.criteria?.availability?.overtimePercent}
          />
        );
      })}
    </div>
  );
};
