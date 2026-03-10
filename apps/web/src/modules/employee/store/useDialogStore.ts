import { create } from 'zustand';
import type { DialogState } from '../types/timeLogs';

export const useDialogStore = create<DialogState>(set => ({
  activeDialog: null,
  dialogData: {},
  openDialog: (type, data = {}) => set({ activeDialog: type, dialogData: data }),
  closeDialog: () => set({ activeDialog: null, dialogData: {} }),
}));
