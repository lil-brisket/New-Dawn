import type { ElementType, EquipmentSlot, ItemRarity } from '../common';
import type { ApplyTagEffect } from '../skill/effects';
import type { TargetSelector, SkillShapeType } from '../skill/targeting';
import type { ApplicationFormula, CombatStatId, DurationFormula, StatFormula } from '../scaling';
import type { HexCoord } from '../battle/grid';

export type StatModMode = 'flat' | 'percent';

/** Authoring metadata — normalized into definitions; engine may ignore until used. */
export interface ContentMetadata {
  category?: string;
  element?: ElementType;
  weaponType?: string;
  job?: string;
  rarity?: ItemRarity;
  labels?: string[];
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
  effects: ApplyTagEffect[];
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

export type TagBehavior =
  | { type: 'instant_damage'; element: ElementType; value: StatFormula; pierce?: boolean }
  | { type: 'instant_heal'; value: StatFormula }
  | { type: 'shield_grant'; value: StatFormula; duration?: number }
  | { type: 'move'; range: number; rangeFormula?: StatFormula; teleport?: boolean }
  | { type: 'teleport'; range: number; rangeFormula?: StatFormula }
  | { type: 'summon'; entityDefinitionId: string; position?: HexCoord }
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
      effect: ApplyTagEffect;
    }
  | { type: 'absorb'; percent: StatFormula }
  | { type: 'lifesteal'; percent: StatFormula }
  | { type: 'reflect'; percent: StatFormula }
  | { type: 'clear'; polarity: 'positive' }
  | { type: 'cleanse'; polarity: 'negative' };

export interface TagDefinition extends ContentMetadata {
  id: string;
  name: string;
  description: string;
  duration: number;
  stackable: boolean;
  maxStacks: number;
  iconId: string;
  behaviors: TagBehavior[];
  applicationFormula?: ApplicationFormula;
  durationFormula?: DurationFormula;
  schemaVersion?: number;
}

/** @deprecated Use TagDefinition */
export type StatusDefinition = TagDefinition;
/** @deprecated Use TagBehavior */
export type StatusBehavior = TagBehavior;
