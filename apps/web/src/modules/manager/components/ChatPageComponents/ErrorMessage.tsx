import { RefreshCw } from 'lucide-react';

export function ErrorMessage({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 mt-4 flex flex-col items-start gap-3">
      <div>
        ⚠️ <strong>Sorry, an error occurred.</strong> I cannot access the system data right now.
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 text-sm font-medium bg-white px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Try again
      </button>
    </div>
  );
}
