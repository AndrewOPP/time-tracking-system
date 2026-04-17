import { SearchX } from 'lucide-react';

export const ScoringEmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 my-4 animate-fade-in">
    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
      <SearchX className="w-6 h-6 text-slate-400" />
    </div>
    <h3 className="text-slate-900 font-semibold text-sm">No candidates found</h3>
    <p className="text-slate-500 text-xs text-center mt-1 max-w-[200px]">
      Try adjusting your filters or search for different skills.
    </p>
  </div>
);
