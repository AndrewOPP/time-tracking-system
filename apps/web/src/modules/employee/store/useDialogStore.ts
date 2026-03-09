import { create } from 'zustand';
import type { TimeLog } from '../types/timeLogs';

type DialogType = 'TRACK_TIME' | 'DELETE_TIME_LOG' | null;

interface DialogData {
  date?: string | null;
  log?: TimeLog;
}

interface DialogState {
  activeDialog: DialogType;
  dialogData: DialogData;
  openDialog: (type: DialogType, data?: DialogData) => void;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogState>(set => ({
  activeDialog: null,
  dialogData: {},
  openDialog: (type, data = {}) => set({ activeDialog: type, dialogData: data }),
  closeDialog: () => set({ activeDialog: null, dialogData: {} }),
}));
