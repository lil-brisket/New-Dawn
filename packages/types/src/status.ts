import type { CombatStatId } from './scaling';

export interface StatusInstance {
  id: string;
  statusDefinitionId: string;
  sourceId: string;
  targetId: string;
  remainingTurns: number;
  stacks: number;
  /** Frozen source combat stats at apply time for consistent DoT/buff scaling */
  sourceSnapshots?: Readonly<Partial<Record<CombatStatId, number>>>;
}

export interface StatusEffect {
  definitionId: string;
  instances: StatusInstance[];
}

export interface DamageResult {
  sourceId: string;
  targetId: string;
  rawDamage: number;
  finalDamage: number;
  isCritical: boolean;
  blocked: boolean;
}
