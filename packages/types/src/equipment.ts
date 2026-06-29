import type { EquipmentSlot } from './common';

export interface EquippedGear {
  weaponId?: string;
  armorId?: string;
  helmetId?: string;
  accessoryId?: string;
  bootsId?: string;
  relicId?: string;
}

export function getSlotKey(slot: EquipmentSlot): keyof EquippedGear {
  const map: Record<EquipmentSlot, keyof EquippedGear> = {
    weapon: 'weaponId',
    armor: 'armorId',
    helmet: 'helmetId',
    accessory: 'accessoryId',
    boots: 'bootsId',
    relic: 'relicId',
  };
  return map[slot] ?? 'weaponId';
}
