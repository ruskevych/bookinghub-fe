import { create } from 'zustand';

// Auth slice
interface AuthState {
  activeBusinessId: string | null;
  setActiveBusinessId: (id: string | null) => void;
}

// UI slice
interface UIState {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  openModal: string | null;
  setOpenModal: (modal: string | null) => void;
}

// Booking flow slice
interface BookingFlowState {
  step: number;
  setStep: (step: number) => void;
}

// Root store type
type AppStore = AuthState & UIState & BookingFlowState;

export const useAppStore = create<AppStore>((set) => ({
  // Auth slice
  activeBusinessId: null,
  setActiveBusinessId: (id) => set({ activeBusinessId: id }),

  // UI slice
  selectedTab: 'services',
  setSelectedTab: (tab) => set({ selectedTab: tab }),
  openModal: null,
  setOpenModal: (modal) => set({ openModal: modal }),

  // Booking flow slice
  step: 0,
  setStep: (step) => set({ step }),
})); 