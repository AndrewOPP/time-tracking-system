import React from 'react';
import { Send } from 'lucide-react';
import { Input } from '@components/ui';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isDisabled: boolean;
}

export function ChatInput({ input, setInput, onSubmit, isDisabled }: ChatInputProps) {
  return (
    <div className="px-4 pb-6 pt-2 shrink-0 bg-white">
      <form
        onSubmit={onSubmit}
        className="max-w-3xl mx-auto flex items-center bg-white border border-slate-200 rounded-2xl shadow-sm focus-within:border-[#7cb9cc] focus-within:ring-1 focus-within:ring-[#7cb9cc] transition-all duration-200 pl-2 pr-2 py-1.5"
      >
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isDisabled}
          placeholder="What are you looking for?"
          className="flex-1 border-none bg-transparent py-3 px-4 text-[15px] focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={isDisabled || !input.trim()}
          className="p-3 ml-2 bg-[#7cb9cc] text-white rounded-xl hover:bg-[#68a6b9] disabled:bg-slate-200 disabled:text-slate-400 transition-colors flex items-center justify-center"
        >
          <Send className="w-4 h-4 -ml-0.5" />
        </button>
      </form>
    </div>
  );
}
