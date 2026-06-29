import { create } from 'zustand';

interface WorldState {
  currentMapId: string | null;
  playerX: number;
  playerY: number;
  setPosition: (mapId: string, x: number, y: number) => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  currentMapId: null,
  playerX: 0,
  playerY: 0,
  setPosition: (currentMapId, playerX, playerY) => set({ currentMapId, playerX, playerY }),
}));
