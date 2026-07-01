import type { ElementType } from '../common';
import type { HexCoord } from '../battle/grid';
import type { ApplicationFormula, CombatStatId, DurationFormula, StatFormula } from '../scaling';

export interface DamageEffect {
  type: 'damage';
  element: ElementType;
  value: StatFormula;
  /** Pure damage that ignores mitigation and breaks shields. */
  pierce?: boolean;
}

export interface HealEffect {
  type: 'heal';
  value: StatFormula;
}

export interface MoveEffect {
  type: 'move';
  range: number;
  rangeFormula?: StatFormula;
}

export interface TeleportEffect {
  type: 'teleport';
  range: number;
  rangeFormula?: StatFormula;
}

export interface BuffEffect {
  type: 'apply_status';
  statusId: string;
  chance: number;
  duration?: number;
  durationFormula?: DurationFormula;
  applicationFormula?: ApplicationFormula;
}

export interface ShieldEffect {
  type: 'shield';
  value: StatFormula;
  /** Turns the shield lasts (max 2). */
  duration?: number;
}

export interface SummonEffect {
  type: 'summon';
  entityDefinitionId: string;
  position?: HexCoord;
}

export type SkillEffect =
  | DamageEffect
  | HealEffect
  | MoveEffect
  | TeleportEffect
  | BuffEffect
  | ShieldEffect
  | SummonEffect;

export type { CombatStatId, StatFormula, DurationFormula, ApplicationFormula };
