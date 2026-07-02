import type { CombatStatId } from './scaling';

export interface TagInstance {
  id: string;
  tagDefinitionId: string;
  sourceId: string;
  targetId: string;
  remainingTurns: number;
  stacks: number;
  /** Frozen source combat stats at apply time for consistent DoT/buff scaling */
  sourceSnapshots?: Readonly<Partial<Record<CombatStatId, number>>>;
}

export interface TagEffect {
  definitionId: string;
  instances: TagInstance[];
}

export interface DamageResult {
  sourceId: string;
  targetId: string;
  rawDamage: number;
  finalDamage: number;
  isCritical: boolean;
  blocked: boolean;
}
