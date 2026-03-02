export function LoadingIndicator() {
  return (
    <div className="flex flex-col w-full">
      <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-3">
        AI Assistant
      </span>
      <div className="flex gap-1.5 items-center h-6">
        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></span>
        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></span>
      </div>
    </div>
  );
}
