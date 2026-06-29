import type { ItemDefinition } from '@dawn/types';

export const healthPotion: ItemDefinition = {
  id: 'item_health_potion',
  name: 'Health Potion',
  description: 'Restores 500 HP.',
  rarity: 'common',
  stackable: true,
  maxStack: 99,
  iconId: 'icon_health_potion',
};

export const manaPotion: ItemDefinition = {
  id: 'item_mana_potion',
  name: 'Mana Potion',
  description: 'Restores 100 MP.',
  rarity: 'common',
  stackable: true,
  maxStack: 99,
  iconId: 'icon_mana_potion',
};
