import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/services/storage/mmkv';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      login: (token) => set({ isAuthenticated: true, token }),
      logout: () => set({ isAuthenticated: false, token: null }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
