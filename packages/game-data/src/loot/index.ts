export interface LootEntry {
  itemId: string;
  minQuantity: number;
  maxQuantity: number;
  dropRate: number;
}

export interface LootTable {
  id: string;
  entries: LootEntry[];
}

export const goblinLoot: LootTable = {
  id: 'loot_goblin',
  entries: [{ itemId: 'item_health_potion', minQuantity: 1, maxQuantity: 2, dropRate: 0.5 }],
};

export const goblinChiefLoot: LootTable = {
  id: 'loot_goblin_chief',
  entries: [
    { itemId: 'item_health_potion', minQuantity: 2, maxQuantity: 5, dropRate: 1.0 },
    { itemId: 'equip_iron_sword', minQuantity: 1, maxQuantity: 1, dropRate: 0.15 },
  ],
};
