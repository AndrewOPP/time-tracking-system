import { SearchX } from 'lucide-react';

interface TableEmptyStateProps {
  message?: string;
}

export function TableEmptyState({
  message = 'No employees found matching your criteria.',
}: TableEmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 px-4 bg-white border border-[#E0E1E2] rounded-md animate-in fade-in duration-500">
      <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
        <SearchX className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">No data found</h3>
      <p className="text-sm text-[#6F6F6F] mt-1 text-center max-w-sm">{message}</p>
    </div>
  );
}
