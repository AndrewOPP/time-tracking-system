import { create } from 'zustand';
import type { ChatStore } from '../managerAIChat.types';

export const useChatStore = create<ChatStore>(set => ({
  savedMessages: [],
  setSavedMessages: messages => set({ savedMessages: messages }),
  clearMessages: () => set({ savedMessages: [] }),
}));
