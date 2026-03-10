import { create } from 'zustand';
import type { ProjectTrackDialogState } from '../types/project.api.types';

export const useDialogStore = create<ProjectTrackDialogState>(set => ({
  isOpen: false,
  dialogData: null,

  openDialog: data =>
    set({
      isOpen: true,
      dialogData: data || null,
    }),

  closeDialog: () =>
    set({
      isOpen: false,
      dialogData: null,
    }),
}));
