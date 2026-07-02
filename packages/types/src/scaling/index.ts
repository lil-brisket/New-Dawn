/** Combat stat identifier — union is codegen'd from combat_stats.json */
export type CombatStatId = string;

export type FormulaTermSource =
  'stat' | 'stacks' | 'level' | 'missing_hp' | 'hp_percent' | 'distance';

export interface FormulaTerm {
  readonly source: FormulaTermSource;
  readonly key: string;
  readonly ratio: number;
}

export interface StatFormula {
  readonly base: number;
  readonly terms: readonly FormulaTerm[];
}

export interface DurationFormula {
  readonly stat: CombatStatId;
  readonly ratio: number;
  readonly maxBonus?: number;
}

export interface ApplicationFormula {
  readonly attackerStat: CombatStatId;
  readonly defenderStat: CombatStatId;
  readonly perPointDelta: number;
}

export interface StatDef {
  readonly id: CombatStatId;
  readonly label: string;
}

export interface TagApplicationFormulaConfig {
  readonly attackerStat: CombatStatId;
  readonly defenderStat: CombatStatId;
  readonly perPointDelta: number;
}

export interface DurationReductionFormulaConfig {
  readonly defenderStat: CombatStatId;
  readonly perPointReduction: number;
  readonly minDuration: number;
}

export interface CombatStatsFormulas {
  readonly tagApplication: TagApplicationFormulaConfig;
  readonly durationReduction: DurationReductionFormulaConfig;
}

export interface CombatStatsConfig {
  readonly schemaVersion: number;
  readonly stats: readonly StatDef[];
  readonly formulas: CombatStatsFormulas;
}

/** @deprecated Use TagApplicationFormulaConfig */
export type StatusApplicationFormulaConfig = TagApplicationFormulaConfig;
