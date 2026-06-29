import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  activeModal: string | null;
  setLoading: (v: boolean) => void;
  setActiveModal: (modal: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  activeModal: null,
  setLoading: (isLoading) => set({ isLoading }),
  setActiveModal: (activeModal) => set({ activeModal }),
}));
