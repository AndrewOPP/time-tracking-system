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

        return (
          <CandidateProgressBar
            key={item.key}
            label={item.label}
            score={data.score}
            reasoning={data.reasoning}
            weight={weight}
          />
        );
      })}
    </div>
  );
};
