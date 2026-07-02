import type { DefinitionRegistry } from '@dawn/game-data';
import type {
  BattleState,
  Combatant,
  CombatStatsConfig,
  SkillDefinition,
  TagDefinition,
  TagInstance,
} from '@dawn/types';
import type { RandomSource } from '@dawn/utils';

export interface EffectContext {
  readonly source: Combatant;
  readonly target: Combatant;
  readonly skill?: SkillDefinition;
  readonly tag?: TagDefinition;
  readonly tagInstance?: TagInstance;
  readonly battle: BattleState;
  readonly registry: DefinitionRegistry;
  readonly combatStats: CombatStatsConfig;
  readonly rng: RandomSource;
  /** When true, stat formulas use raw combatant stats and ignore tag stat_mod behaviors. */
  readonly ignoreStatMods?: boolean;
  /** @deprecated Use tag */
  readonly status?: TagDefinition;
  /** @deprecated Use tagInstance */
  readonly statusInstance?: TagInstance;
}

export function createEffectContext(params: {
  source: Combatant;
  target: Combatant;
  battle: BattleState;
  registry: DefinitionRegistry;
  combatStats: CombatStatsConfig;
  rng: RandomSource;
  skill?: SkillDefinition;
  tag?: TagDefinition;
  tagInstance?: TagInstance;
  status?: TagDefinition;
  statusInstance?: TagInstance;
  ignoreStatMods?: boolean;
}): EffectContext {
  return {
    ...params,
    tag: params.tag ?? params.status,
    tagInstance: params.tagInstance ?? params.statusInstance,
    status: params.tag ?? params.status,
    statusInstance: params.tagInstance ?? params.statusInstance,
  };
}
