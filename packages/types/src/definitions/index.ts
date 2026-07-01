import type { ElementType, EquipmentSlot, ItemRarity } from '../common';
import type { SkillEffect } from '../skill/effects';
import type { TargetSelector, SkillShapeType } from '../skill/targeting';
import type { ApplicationFormula, CombatStatId, DurationFormula, StatFormula } from '../scaling';

export type StatModMode = 'flat' | 'percent';

/** Authoring metadata — normalized into definitions; engine may ignore until used. */
export interface ContentMetadata {
  category?: string;
  element?: ElementType;
  weaponType?: string;
  job?: string;
  rarity?: ItemRarity;
  tags?: string[];
  unlockLevel?: number;
}

export interface BaseStats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;
  willpower: number;
  resistance: number;
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

export interface SkillDefinition extends ContentMetadata {
  id: string;
  name: string;
  description: string;
  hpCost: number;
  spCost: number;
  apCost: number;
  cooldown: number;
  effects: SkillEffect[];
  targeting: TargetSelector;
  shapeType?: SkillShapeType;
  iconId: string;
  vfxId: string;
  sfxId: string;
  /** Engine/display compat — set from vfxId during normalization */
  animationKey: string;
  /** Engine/display compat — set from sfxId during normalization */
  soundKey: string;
  schemaVersion?: number;
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

export interface EnemyDefinition extends ContentMetadata {
  id: string;
  name: string;
  description: string;
  portraitId: string;
  spriteId: string;
  baseStats: BaseStats;
  skillIds: string[];
  aiProfileId: string;
  lootTableId: string;
  element: ElementType;
  schemaVersion?: number;
}

export type StatusBehavior =
  | { type: 'dot'; element: ElementType; damagePerTurn: StatFormula }
  | { type: 'control'; effect: 'stun' | 'bind' }
  | {
      type: 'stat_mod';
      stat: CombatStatId;
      mode: StatModMode;
      value: StatFormula;
    }
  | {
      type: 'trigger';
      event: 'on_hit' | 'on_damaged' | 'on_turn_start' | 'on_move' | 'on_attack';
      effect: SkillEffect;
    };

export interface StatusDefinition extends ContentMetadata {
  id: string;
  name: string;
  description: string;
  duration: number;
  stackable: boolean;
  maxStacks: number;
  iconId: string;
  behaviors: StatusBehavior[];
  applicationFormula?: ApplicationFormula;
  durationFormula?: DurationFormula;
  schemaVersion?: number;
}
