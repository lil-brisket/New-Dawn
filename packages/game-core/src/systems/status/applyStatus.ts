export type { StatusApplicationInput, StatusApplicationResult } from './resolveStatusApplication';
export { resolveStatusApplication } from './resolveStatusApplication';

import type { DefinitionRegistry } from '@dawn/game-data';
import type { BattleEvent, BattleState } from '@dawn/types';
import type { RandomSource } from '@dawn/utils';
import { createEffectContext } from '../scaling/EffectContext';
import { resolveStatusApplication } from './resolveStatusApplication';

export interface ApplyStatusInput {
  readonly state: BattleState;
  readonly sourceId: string;
  readonly targetId: string;
  readonly statusId: string;
  readonly chance: number;
  readonly durationOverride?: number;
  readonly registry: DefinitionRegistry;
  readonly rng: RandomSource;
}

export interface ApplyStatusResult {
  readonly state: BattleState;
  readonly events: readonly BattleEvent[];
  readonly applied: boolean;
}

/** Backward-compatible wrapper around resolveStatusApplication */
export function applyStatus(input: ApplyStatusInput): ApplyStatusResult {
  const source = input.state.combatants.get(input.sourceId);
  const target = input.state.combatants.get(input.targetId);
  if (!source || !target) {
    return { state: input.state, events: [], applied: false };
  }

  const ctx = createEffectContext({
    source,
    target,
    battle: input.state,
    registry: input.registry,
    combatStats: input.registry.getCombatStatsConfig(),
    rng: input.rng,
  });

  const result = resolveStatusApplication({
    ctx,
    statusId: input.statusId,
    baseChance: input.chance,
    baseDuration: input.durationOverride,
  });

  return {
    state: result.state,
    events: result.events,
    applied: result.applied,
  };
}
