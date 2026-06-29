import { create } from 'zustand';
import type { InventoryItem } from '@dawn/types';

interface InventoryState {
  items: InventoryItem[];
  gold: number;
  setItems: (items: InventoryItem[]) => void;
  setGold: (gold: number) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  items: [],
  gold: 0,
  setItems: (items) => set({ items }),
  setGold: (gold) => set({ gold }),
}));
