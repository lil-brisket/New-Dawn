import type { DefinitionRegistry } from '@dawn/game-data';
import type {
  BattleState,
  Combatant,
  CombatStatsConfig,
  SkillDefinition,
  StatusDefinition,
  StatusInstance,
} from '@dawn/types';
import type { RandomSource } from '@dawn/utils';

export interface EffectContext {
  readonly source: Combatant;
  readonly target: Combatant;
  readonly skill?: SkillDefinition;
  readonly status?: StatusDefinition;
  readonly statusInstance?: StatusInstance;
  readonly battle: BattleState;
  readonly registry: DefinitionRegistry;
  readonly combatStats: CombatStatsConfig;
  readonly rng: RandomSource;
}

export function createEffectContext(params: {
  source: Combatant;
  target: Combatant;
  battle: BattleState;
  registry: DefinitionRegistry;
  combatStats: CombatStatsConfig;
  rng: RandomSource;
  skill?: SkillDefinition;
  status?: StatusDefinition;
  statusInstance?: StatusInstance;
}): EffectContext {
  return params;
}
