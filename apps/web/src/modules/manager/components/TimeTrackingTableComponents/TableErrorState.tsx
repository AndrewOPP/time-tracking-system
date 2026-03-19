import { AlertCircle, RefreshCw } from 'lucide-react';

interface TableErrorStateProps {
  error?: string;
  onRetry?: () => void;
}

export function TableErrorState({
  error = 'Failed to load employee data. Please try again later.',
  onRetry,
}: TableErrorStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 px-4 bg-white border border-[#E0E1E2] rounded-md animate-in fade-in duration-500">
      <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">Something went wrong</h3>
      <p className="text-sm text-[#6F6F6F] mt-1 mb-5 text-center max-w-sm">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E0E1E2] hover:bg-gray-50 text-gray-700 rounded-md transition-colors text-sm font-medium"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
