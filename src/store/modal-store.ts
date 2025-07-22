// modalStore.ts
import { create } from 'zustand';

interface ModalState {
  modals: Record<string, boolean>; // Keeps track of whether each modal is open
  openModal: (key: string) => void;
  closeModal: (key: string) => void;
  isModalOpen: (key: string) => boolean;
}

export const useModalStore = create<ModalState>((set, get) => ({
  modals: {},

  openModal: (key) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [key]: true,
      },
    }));
  },

  closeModal: (key) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [key]: false,
      },
    }));
  },

  isModalOpen: (key) => {
    const modal = get().modals[key];
    return modal ?? false;
  },
}));
export enum Modals {
  CREATE_MATERIAL_MODAL = 'create-material-modal',
  CREATE_DOCTOR_MODAL = 'create-doctor-modal',
  UPDATE_MATERIAL_MODAL = 'update-material-modal',
  UPDATE_DOCTOR_MODAL = 'update-doctor-modal',
  UPDATE_CASE_MODAL = 'update-case-modal',
  DASHBOARD_COMMAND_MODAL = 'dashboard-command-modal',
}
