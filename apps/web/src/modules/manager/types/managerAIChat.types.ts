import type { UIMessage } from 'ai';

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatStore {
  savedMessages: UIMessage[];
  setSavedMessages: (messages: UIMessage[]) => void;
  clearMessages: () => void;
}
