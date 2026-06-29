import type { ElementType, EquipmentSlot, ItemRarity } from '../common';
import type { SkillEffect } from '../skill/effects';
import type { TargetSelector } from '../skill/targeting';

export interface BaseStats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;
  critRate: number;
  critDamage: number;
}

export interface CharacterDefinition {
  id: string;
  name: string;
  description: string;
  portraitId: string;
  baseStats: BaseStats;
  skillIds: string[];
  element: ElementType;
  rarity: ItemRarity;
}

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  mpCost: number;
  cooldown: number;
  effects: SkillEffect[];
  targeting: TargetSelector;
  animationKey: string;
  soundKey: string;
}

export interface EquipmentDefinition {
  id: string;
  name: string;
  description: string;
  slot: EquipmentSlot;
  rarity: ItemRarity;
  statMods: Partial<BaseStats>;
  iconId: string;
}

export interface ItemDefinition {
  id: string;
  name: string;
  description: string;
  rarity: ItemRarity;
  stackable: boolean;
  maxStack: number;
  iconId: string;
}

export interface EnemyDefinition {
  id: string;
  name: string;
  description: string;
  portraitId: string;
  baseStats: BaseStats;
  skillIds: string[];
  aiProfileId: string;
  lootTableId: string;
  element: ElementType;
}

export interface StatusDefinition {
  id: string;
  name: string;
  description: string;
  duration: number;
  stackable: boolean;
  maxStacks: number;
  iconId: string;
}
