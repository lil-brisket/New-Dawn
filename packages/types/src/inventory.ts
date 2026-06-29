import type { ItemRarity } from './common';

export interface InventoryItem {
  id: string;
  definitionId: string;
  quantity: number;
  rarity: ItemRarity;
}

export interface PlayerInventory {
  items: InventoryItem[];
  maxSlots: number;
  gold: number;
}
