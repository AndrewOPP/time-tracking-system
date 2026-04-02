import React from 'react';
import type { ScoringCandidate } from '../ScoringCards';
import { CandidateProgressBar } from './CandidateProgressBar';

export const CandidateCriteria = ({ candidate }: { candidate: ScoringCandidate }) => {
  const criteriaItems = [
    { key: 'skillsMatch', weightKey: 'skills', label: 'Skills' },
    { key: 'availability', weightKey: 'availability', label: 'Availability' },
    { key: 'domainExperience', weightKey: 'domain', label: 'Domain' },
  ] as const;

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-4">
      {criteriaItems.map(item => {
        const data = candidate.criteria[item.key];
        const weight = candidate.appliedWeights[item.weightKey];

        let tooltipContent: React.ReactNode = data.reasoning;

        if (item.key === 'skillsMatch') {
          const skillsData = candidate.criteria.skillsMatch;

          if (skillsData.matched?.length || skillsData.missing?.length) {
            tooltipContent = (
              <div className="flex flex-col gap-1.5">
                {skillsData.matched && skillsData.matched.length > 0 && (
                  <div>
                    <span className="font-semibold text-green-400">Matched: </span>
                    <span>{skillsData.matched.join(', ')}</span>
                  </div>
                )}
                {skillsData.missing && skillsData.missing.length > 0 && (
                  <div>
                    <span className="font-semibold text-red-400">Missing: </span>
                    <span>{skillsData.missing.join(', ')}</span>
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
            score={data.score}
            reasoning={tooltipContent}
            weight={weight}
            userTimeLoad={
              item.key === 'availability' ? candidate.criteria.availability.userTimeLoad : null
            }
          />
        );
      })}
    </div>
  );
};
