import type { EquipmentDefinition } from '@dawn/types';

export const ironSword: EquipmentDefinition = {
  id: 'equip_iron_sword',
  name: 'Iron Sword',
  description: 'A reliable blade forged from iron.',
  slot: 'weapon',
  rarity: 'common',
  statMods: { attack: 15 },
  iconId: 'icon_iron_sword',
};

export const dawnArmor: EquipmentDefinition = {
  id: 'equip_dawn_armor',
  name: 'Dawn Armor',
  description: 'Armor blessed by the morning light.',
  slot: 'armor',
  rarity: 'rare',
  statMods: { defense: 25, maxHp: 100 },
  iconId: 'icon_dawn_armor',
};
