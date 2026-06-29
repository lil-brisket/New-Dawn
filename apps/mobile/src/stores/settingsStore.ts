import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { appStorage } from '@/services/storage';

interface SettingsState {
  musicVolume: number;
  sfxVolume: number;
  notificationsEnabled: boolean;
  setMusicVolume: (v: number) => void;
  setSfxVolume: (v: number) => void;
  setNotificationsEnabled: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      musicVolume: 0.8,
      sfxVolume: 1.0,
      notificationsEnabled: true,
      setMusicVolume: (musicVolume) => set({ musicVolume }),
      setSfxVolume: (sfxVolume) => set({ sfxVolume }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => appStorage),
    },
  ),
);
