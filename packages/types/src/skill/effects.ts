import type { ElementType } from '../common';
import type { HexCoord } from '../battle/grid';
import type { ApplicationFormula, CombatStatId, DurationFormula, StatFormula } from '../scaling';

/** Per-skill overrides merged into tag behaviors at resolve time */
export interface TagBehaviorOverrides {
  instant_damage?: Partial<{
    element: ElementType;
    value: StatFormula;
    pierce?: boolean;
  }>;
  instant_heal?: Partial<{ value: StatFormula }>;
  shield_grant?: Partial<{ value: StatFormula; duration?: number }>;
  move?: Partial<{ range: number; rangeFormula?: StatFormula; teleport?: boolean }>;
  teleport?: Partial<{ range: number; rangeFormula?: StatFormula }>;
  summon?: Partial<{ entityDefinitionId: string; position?: HexCoord }>;
}

export interface ApplyTagEffect {
  type: 'apply_tag';
  tagId: string;
  chance: number;
  duration?: number;
  durationFormula?: DurationFormula;
  applicationFormula?: ApplicationFormula;
  overrides?: TagBehaviorOverrides;
}

export type SkillEffect = ApplyTagEffect;

export type { CombatStatId, StatFormula, DurationFormula, ApplicationFormula };
