import type { ApplicationFormula, CombatStatId, DurationFormula } from '@dawn/types';
import type { BattleEvent, BattleState } from '@dawn/types';
import { createId } from '@dawn/utils';
import { withStatuses } from '../../entities/Combatant';
import { getCombatant } from '../../queries/getActiveCombatant';
import { updateMap } from '../../utils/immutable';
import type { EffectContext } from '../scaling/EffectContext';
import {
  calculateApplicationChance,
  calculateDuration,
  createSourceSnapshots,
} from '../scaling/statusFormulas';
import { statusHookDispatcher } from './hooks/dispatcher';

export interface StatusApplicationInput {
  readonly ctx: EffectContext;
  readonly statusId: string;
  readonly baseChance: number;
  readonly baseDuration?: number;
  readonly durationFormula?: DurationFormula;
  readonly applicationFormula?: ApplicationFormula;
}

export interface StatusApplicationResult {
  readonly applied: boolean;
  readonly state: BattleState;
  readonly events: readonly BattleEvent[];
}

function checkImmunity(_ctx: EffectContext, _statusId: string): boolean {
  return false;
}

export function resolveStatusApplication(input: StatusApplicationInput): StatusApplicationResult {
  const { ctx, statusId, baseChance, durationFormula, applicationFormula } = input;
  const definition = ctx.registry.getStatus(statusId);
  if (!definition) {
    return { applied: false, state: ctx.battle, events: [] };
  }

  const target = getCombatant(ctx.battle, ctx.target.id);
  if (!target) {
    return { applied: false, state: ctx.battle, events: [] };
  }

  if (checkImmunity(ctx, statusId)) {
    return { applied: false, state: ctx.battle, events: [] };
  }

  const appFormula = applicationFormula ?? definition.applicationFormula;
  const finalChance = calculateApplicationChance(baseChance, ctx, appFormula);
  if (!ctx.rng.chance(finalChance)) {
    return { applied: false, state: ctx.battle, events: [] };
  }

  const baseDuration = input.baseDuration ?? definition.duration;
  const durFormula = durationFormula ?? definition.durationFormula;
  const duration = calculateDuration(baseDuration, ctx, durFormula);

  const hookCtx = {
    ...ctx,
    target,
    status: definition,
    events: [] as BattleEvent[],
  };

  statusHookDispatcher.dispatch('onBeforeApply', hookCtx);

  const statIds = ctx.combatStats.stats.map((s) => s.id) as CombatStatId[];
  const snapshots = createSourceSnapshots(ctx, statIds);
  const existing = target.statuses.find((s) => s.statusDefinitionId === statusId);
  let nextStatuses;
  let stacks: number;

  if (existing) {
    if (!definition.stackable) {
      nextStatuses = target.statuses.map((s) =>
        s.statusDefinitionId === statusId
          ? { ...s, remainingTurns: duration, stacks: 1, sourceSnapshots: snapshots }
          : s,
      );
      stacks = 1;
    } else {
      const newStacks = Math.min(existing.stacks + 1, definition.maxStacks);
      nextStatuses = target.statuses.map((s) =>
        s.statusDefinitionId === statusId
          ? { ...s, remainingTurns: duration, stacks: newStacks, sourceSnapshots: snapshots }
          : s,
      );
      stacks = newStacks;
    }
  } else {
    const instance = {
      id: createId('status'),
      statusDefinitionId: statusId,
      sourceId: ctx.source.id,
      targetId: target.id,
      remainingTurns: duration,
      stacks: 1,
      sourceSnapshots: snapshots,
    };
    nextStatuses = [...target.statuses, instance];
    stacks = 1;
  }

  const updated = withStatuses(target, nextStatuses);
  const state: BattleState = {
    ...ctx.battle,
    combatants: updateMap(ctx.battle.combatants, target.id, updated),
  };

  const instance = nextStatuses.find((s) => s.statusDefinitionId === statusId)!;
  statusHookDispatcher.dispatch('onApply', {
    ...hookCtx,
    statusInstance: instance,
    instance,
    target: updated,
  });

  const events: BattleEvent[] = [
    ...hookCtx.events,
    {
      type: 'status_applied',
      sourceId: ctx.source.id,
      targetId: target.id,
      statusId,
      stacks,
    },
  ];

  return { state, events, applied: true };
}
