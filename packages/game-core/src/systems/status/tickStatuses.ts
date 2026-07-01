import type { DefinitionRegistry } from '@dawn/game-data';
import type { BattleEvent, BattleState, StatusInstance } from '@dawn/types';
import { withStatuses } from '../../entities/Combatant';
import { applyIncomingDamage } from '../combat/resolveIncomingDamage';
import { getCombatant } from '../../queries/getActiveCombatant';
import { isCombatantAlive } from '../../queries/isCombatantAlive';
import { updateMap } from '../../utils/immutable';
import { createEffectContext } from '../scaling/EffectContext';
import { evaluateFormula } from '../scaling/getEffectiveStat';
import { statusHookDispatcher } from './hooks/dispatcher';

const noopRng = {
  chance: () => true,
  next: () => 0.5,
  nextInt: (min: number) => min,
};

export interface StatusTickResult {
  readonly state: BattleState;
  readonly events: readonly BattleEvent[];
}

export function tickStatuses(
  state: BattleState,
  combatantId: string,
  registry: DefinitionRegistry,
): StatusTickResult {
  const combatant = getCombatant(state, combatantId);
  if (!combatant || combatant.statuses.length === 0) {
    return { state, events: [] };
  }

  const events: BattleEvent[] = [];
  let current = combatant;
  const combatStats = registry.getCombatStatsConfig();

  for (const instance of combatant.statuses) {
    const def = registry.getStatus(instance.statusDefinitionId);
    if (!def) continue;

    for (const behavior of def.behaviors) {
      if (behavior.type !== 'dot') continue;

      const source = getCombatant(state, instance.sourceId);
      const effectCtx = createEffectContext({
        source: source ?? current,
        target: current,
        battle: state,
        registry,
        combatStats,
        rng: noopRng,
        status: def,
        statusInstance: instance,
      });

      const perStack = evaluateFormula(behavior.damagePerTurn, effectCtx, instance);
      const damage = perStack * instance.stacks;
      if (damage <= 0) continue;

      const result = applyIncomingDamage(current, damage, false);
      current = result.combatant;

      events.push({
        type: 'status_tick',
        targetId: combatantId,
        statusId: instance.statusDefinitionId,
        damage: result.hpDamage + result.shieldDamage,
      });

      if (result.hpDamage > 0) {
        events.push({
          type: 'damage_dealt',
          sourceId: instance.sourceId,
          targetId: combatantId,
          amount: result.hpDamage,
          reason: 'status',
          statusId: instance.statusDefinitionId,
          element: behavior.element,
        });
      }

      if (result.shieldDamage > 0) {
        events.push({
          type: 'damage_dealt',
          sourceId: instance.sourceId,
          targetId: combatantId,
          amount: result.shieldDamage,
          reason: 'shield',
          statusId: instance.statusDefinitionId,
        });
      }

      if (!isCombatantAlive(current)) {
        break;
      }
    }
  }

  if (current === combatant) {
    return { state, events };
  }

  return {
    state: {
      ...state,
      combatants: updateMap(state.combatants, combatantId, current),
    },
    events,
  };
}

export function decayStatuses(
  state: BattleState,
  combatantId: string,
  registry: DefinitionRegistry,
): StatusTickResult {
  const combatant = getCombatant(state, combatantId);
  if (!combatant || combatant.statuses.length === 0) {
    return { state, events: [] };
  }

  const events: BattleEvent[] = [];
  const remaining: StatusInstance[] = [];
  const combatStats = registry.getCombatStatsConfig();

  for (const instance of combatant.statuses) {
    const nextTurns = instance.remainingTurns - 1;
    if (nextTurns > 0) {
      remaining.push({ ...instance, remainingTurns: nextTurns });
    } else {
      const def = registry.getStatus(instance.statusDefinitionId);
      const hookCtx = {
        source: getCombatant(state, instance.sourceId) ?? combatant,
        target: combatant,
        battle: state,
        registry,
        combatStats,
        rng: noopRng,
        status: def,
        statusInstance: instance,
        instance,
        events: [] as BattleEvent[],
      };
      statusHookDispatcher.dispatch('onExpire', hookCtx);
      events.push(...hookCtx.events);
      events.push({
        type: 'status_removed',
        targetId: combatantId,
        statusId: instance.statusDefinitionId,
      });
    }
  }

  if (remaining.length === combatant.statuses.length) {
    const allSame = remaining.every(
      (r, i) => r.remainingTurns === combatant.statuses[i]!.remainingTurns,
    );
    if (allSame) {
      return { state, events: [] };
    }
  }

  const updated = withStatuses(combatant, remaining);
  return {
    state: {
      ...state,
      combatants: updateMap(state.combatants, combatantId, updated),
    },
    events,
  };
}

export function decrementCooldowns(state: BattleState, combatantId: string): BattleState {
  const combatant = getCombatant(state, combatantId);
  if (!combatant) return state;

  const nextCooldowns: Record<string, number> = {};
  let changed = false;

  for (const [skillId, turns] of Object.entries(combatant.skillCooldowns)) {
    if (turns > 1) {
      nextCooldowns[skillId] = turns - 1;
      changed = true;
    } else if (turns === 1) {
      nextCooldowns[skillId] = 0;
      changed = true;
    }
  }

  if (!changed) return state;

  return {
    ...state,
    combatants: updateMap(state.combatants, combatantId, {
      ...combatant,
      skillCooldowns: nextCooldowns,
    }),
  };
}
