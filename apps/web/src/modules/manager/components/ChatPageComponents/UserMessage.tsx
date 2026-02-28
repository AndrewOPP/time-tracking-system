export function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end w-full">
      <div className="bg-white border border-slate-200 text-slate-800 px-6 py-3.5 rounded-3xl shadow-sm text-[15px] font-medium max-w-[85%]">
        {content}
      </div>
    </div>
  );
}
