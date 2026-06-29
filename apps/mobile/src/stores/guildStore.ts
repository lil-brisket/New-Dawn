import { create } from 'zustand';
import type { Guild } from '@dawn/types';

interface GuildState {
  guild: Guild | null;
  setGuild: (guild: Guild | null) => void;
}

export const useGuildStore = create<GuildState>((set) => ({
  guild: null,
  setGuild: (guild) => set({ guild }),
}));
