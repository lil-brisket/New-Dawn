import type { DefinitionRegistry } from '@dawn/game-data';
import type { BattleEvent, BattleState } from '@dawn/types';
import type { RandomSource } from '@dawn/utils';
import { getCombatant } from '../../queries/getActiveCombatant';
import { updateMap } from '../../utils/immutable';
import { createAbilityContext } from '../skill/AbilityContext';
import { resolveEffect } from '../skill/effects';
import type { StatusBehavior } from '@dawn/types';

export type StatusTriggerEvent = Extract<StatusBehavior, { type: 'trigger' }>['event'];

export function dispatchStatusTriggers(
  state: BattleState,
  combatantId: string,
  event: StatusTriggerEvent,
  registry: DefinitionRegistry,
  rng: RandomSource,
  sourceId?: string,
): { state: BattleState; events: BattleEvent[] } {
  const combatant = getCombatant(state, combatantId);
  if (!combatant) return { state, events: [] };

  const events: BattleEvent[] = [];
  let currentState = state;

  for (const instance of combatant.statuses) {
    const def = registry.getStatus(instance.statusDefinitionId);
    if (!def) continue;

    for (const behavior of def.behaviors) {
      if (behavior.type !== 'trigger' || behavior.event !== event) continue;

      const source = getCombatant(currentState, instance.sourceId) ?? combatant;
      const target = getCombatant(currentState, combatantId)!;

      const ctx = createAbilityContext({
        battle: currentState,
        source,
        targets: [target],
        targetTile: undefined,
        skill: undefined,
        registry,
        rng,
      });

      resolveEffect(behavior.effect, ctx);
      events.push(...ctx.events);
      currentState = ctx.battle;
    }
  }

  if (sourceId && event === 'on_attack') {
    void sourceId;
  }

  return { state: currentState, events };
}

export function decayShields(state: BattleState, combatantId: string): BattleState {
  const combatant = getCombatant(state, combatantId);
  if (!combatant || !(combatant.shieldHp ?? 0)) return state;

  const nextTurns = (combatant.shieldTurns ?? 1) - 1;
  if (nextTurns <= 0) {
    return {
      ...state,
      combatants: updateMap(state.combatants, combatantId, {
        ...combatant,
        shieldHp: 0,
        shieldTurns: 0,
      }),
    };
  }

  return {
    ...state,
    combatants: updateMap(state.combatants, combatantId, {
      ...combatant,
      shieldTurns: nextTurns,
    }),
  };
}
