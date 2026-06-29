import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PlayerCharacter } from '@dawn/types';
import { appStorage } from '@/services/storage';

interface PlayerState {
  displayName: string;
  characters: PlayerCharacter[];
  setDisplayName: (name: string) => void;
  setCharacters: (characters: PlayerCharacter[]) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      displayName: 'Adventurer',
      characters: [],
      setDisplayName: (displayName) => set({ displayName }),
      setCharacters: (characters) => set({ characters }),
    }),
    {
      name: 'player-store',
      storage: createJSONStorage(() => appStorage),
    },
  ),
);
