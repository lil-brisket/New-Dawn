import type { DefinitionRegistry } from '@dawn/game-data';
import type { BattleEvent, BattleState, StatusInstance } from '@dawn/types';
import { withHp, withStatuses } from '../../entities/Combatant';
import { getCombatant } from '../../queries/getActiveCombatant';
import { isCombatantAlive } from '../../queries/isCombatantAlive';
import { updateMap } from '../../utils/immutable';

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

  for (const instance of combatant.statuses) {
    const def = registry.getStatus(instance.statusDefinitionId);
    if (!def) continue;

    for (const behavior of def.behaviors) {
      if (behavior.type !== 'dot') continue;

      const damage = behavior.damagePerStack * instance.stacks;
      if (damage <= 0) continue;

      const newHp = current.hp - damage;
      current = withHp(current, newHp);

      events.push({
        type: 'status_tick',
        targetId: combatantId,
        statusId: instance.statusDefinitionId,
        damage,
      });

      events.push({
        type: 'damage_dealt',
        sourceId: instance.sourceId,
        targetId: combatantId,
        amount: damage,
        reason: 'status',
        statusId: instance.statusDefinitionId,
        element: behavior.element,
      });

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
  _registry: DefinitionRegistry,
): StatusTickResult {
  const combatant = getCombatant(state, combatantId);
  if (!combatant || combatant.statuses.length === 0) {
    return { state, events: [] };
  }

  const events: BattleEvent[] = [];
  const remaining: StatusInstance[] = [];

  for (const instance of combatant.statuses) {
    const nextTurns = instance.remainingTurns - 1;
    if (nextTurns > 0) {
      remaining.push({ ...instance, remainingTurns: nextTurns });
    } else {
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
