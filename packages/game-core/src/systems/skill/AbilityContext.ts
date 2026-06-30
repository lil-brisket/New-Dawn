import type { DefinitionRegistry } from '@dawn/game-data';
import type { BattleEvent, BattleState, Combatant, HexCoord, SkillDefinition } from '@dawn/types';
import type { RandomSource } from '@dawn/utils';

export interface AbilityContext {
  battle: BattleState;
  source: Combatant;
  targets: Combatant[];
  targetTile?: HexCoord;
  skill?: SkillDefinition;
  registry: DefinitionRegistry;
  rng: RandomSource;
  events: BattleEvent[];
}

export function createAbilityContext(params: {
  battle: BattleState;
  source: Combatant;
  targets: Combatant[];
  targetTile?: HexCoord;
  skill?: SkillDefinition;
  registry: DefinitionRegistry;
  rng: RandomSource;
}): AbilityContext {
  return {
    ...params,
    events: [],
  };
}
