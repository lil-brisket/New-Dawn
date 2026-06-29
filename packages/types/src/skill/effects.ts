import type { ElementType } from '../common';
import type { HexCoord } from '../battle/grid';

export interface DamageEffect {
  type: 'damage';
  element: ElementType;
  multiplier: number;
  flatBonus?: number;
}

export interface HealEffect {
  type: 'heal';
  multiplier: number;
  flatBonus?: number;
}

export interface MoveEffect {
  type: 'move';
  range: number;
}

export interface BuffEffect {
  type: 'apply_status';
  statusId: string;
  chance: number;
  duration?: number;
}

export interface SummonEffect {
  type: 'summon';
  entityDefinitionId: string;
  position?: HexCoord;
}

export type SkillEffect = DamageEffect | HealEffect | MoveEffect | BuffEffect | SummonEffect;
