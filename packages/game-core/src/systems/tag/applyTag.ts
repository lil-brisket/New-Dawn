export type { TagApplicationInput, TagApplicationResult } from './resolveTagApplication';
export { resolveTagApplication } from './resolveTagApplication';

import type { DefinitionRegistry } from '@dawn/game-data';
import type { BattleEvent, BattleState, TagBehaviorOverrides } from '@dawn/types';
import type { RandomSource } from '@dawn/utils';
import { createEffectContext } from '../scaling/EffectContext';
import { resolveTagApplication } from './resolveTagApplication';

export interface ApplyTagInput {
  readonly state: BattleState;
  readonly sourceId: string;
  readonly targetId: string;
  readonly tagId: string;
  readonly chance: number;
  readonly durationOverride?: number;
  readonly overrides?: TagBehaviorOverrides;
  readonly registry: DefinitionRegistry;
  readonly rng: RandomSource;
}

export interface ApplyTagResult {
  readonly state: BattleState;
  readonly events: readonly BattleEvent[];
  readonly applied: boolean;
}

export function applyTag(input: ApplyTagInput): ApplyTagResult {
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

  const result = resolveTagApplication({
    ctx,
    tagId: input.tagId,
    baseChance: input.chance,
    baseDuration: input.durationOverride,
    overrides: input.overrides,
  });

  return {
    state: result.state,
    events: result.events,
    applied: result.applied,
  };
}

/** @deprecated Use applyTag */
export const applyStatus = applyTag;
