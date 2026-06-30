import type { DefinitionRegistry } from '@dawn/game-data';
import type { BattleEvent, BattleState, StatusInstance } from '@dawn/types';
import { createId } from '@dawn/utils';
import type { RandomSource } from '@dawn/utils';
import { withStatuses } from '../../entities/Combatant';
import { getCombatant } from '../../queries/getActiveCombatant';
import { updateMap } from '../../utils/immutable';

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

export function applyStatus(input: ApplyStatusInput): ApplyStatusResult {
  const { chance, registry, rng, sourceId, statusId, targetId } = input;
  if (!rng.chance(chance)) {
    return { state: input.state, events: [], applied: false };
  }

  const definition = registry.getStatus(statusId);
  if (!definition) {
    return { state: input.state, events: [], applied: false };
  }

  const target = getCombatant(input.state, targetId);
  if (!target) {
    return { state: input.state, events: [], applied: false };
  }

  const duration = input.durationOverride ?? definition.duration;
  const existing = target.statuses.find((s) => s.statusDefinitionId === statusId);
  let nextStatuses: StatusInstance[];
  let stacks: number;

  if (existing) {
    if (!definition.stackable) {
      nextStatuses = target.statuses.map((s) =>
        s.statusDefinitionId === statusId ? { ...s, remainingTurns: duration, stacks: 1 } : s,
      );
      stacks = 1;
    } else {
      const newStacks = Math.min(existing.stacks + 1, definition.maxStacks);
      nextStatuses = target.statuses.map((s) =>
        s.statusDefinitionId === statusId
          ? { ...s, remainingTurns: duration, stacks: newStacks }
          : s,
      );
      stacks = newStacks;
    }
  } else {
    const instance: StatusInstance = {
      id: createId('status'),
      statusDefinitionId: statusId,
      sourceId,
      targetId,
      remainingTurns: duration,
      stacks: 1,
    };
    nextStatuses = [...target.statuses, instance];
    stacks = 1;
  }

  const updated = withStatuses(target, nextStatuses);
  const state: BattleState = {
    ...input.state,
    combatants: updateMap(input.state.combatants, targetId, updated),
  };

  const events: BattleEvent[] = [
    {
      type: 'status_applied',
      sourceId,
      targetId,
      statusId,
      stacks,
    },
  ];

  return { state, events, applied: true };
}
