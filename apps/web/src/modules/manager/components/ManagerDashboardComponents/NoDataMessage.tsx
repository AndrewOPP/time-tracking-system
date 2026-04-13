import { Activity } from 'lucide-react';

export function NoDataMessage({ message }: { message: string }) {
  return (
    <div className="p-8 text-center flex flex-col items-center justify-center text-slate-400">
      <div className="w-12 h-12 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mb-3">
        <Activity className="w-5 h-5 opacity-20" />
      </div>
      <p className="text-sm">{message}</p>
    </div>
  );
}
