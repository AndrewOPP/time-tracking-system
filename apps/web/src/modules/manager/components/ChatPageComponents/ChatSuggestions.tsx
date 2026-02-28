const SUGGESTIONS = [
  { id: '01', text: 'Find developers with React experience' },
  { id: '02', text: 'Which employees are currently available?' },
  { id: '03', text: 'Find available backend developers' },
];

export function ChatSuggestions({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-500 pb-10">
      <div className="w-16 h-16 bg-[#002f49] rounded-full flex items-center justify-center mb-6 shadow-sm">
        <span className="text-white font-bold text-xl">AI</span>
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">How can I help you?</h2>
      <p className="text-slate-500 mb-10 text-[15px]">Choose a common request or type your own</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {SUGGESTIONS.map(suggestion => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion.text)}
            className="cursor-pointer flex flex-col text-left p-6 border border-slate-200 rounded-2xl bg-white hover:border-slate-300 hover:shadow-md transition-all group"
          >
            <span className="text-[12px] font-bold text-[#7cb9cc] bg-blue-50/50 px-2 py-1 rounded-full mb-4 w-max">
              {suggestion.id}
            </span>
            <span className="text-[14px] text-slate-700 font-medium leading-relaxed">
              {suggestion.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
