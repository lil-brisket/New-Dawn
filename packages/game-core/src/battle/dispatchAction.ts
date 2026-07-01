import type { ActionResult, BattleAction, BattleEvent, BattleState } from '@dawn/types';
import { defaultRegistry } from '@dawn/game-data';
import { validateMove } from '../systems/movement/validate';
import { calculateMove } from '../systems/movement/calculate';
import { applyMove } from '../systems/movement/apply';
import { validateAttack } from '../systems/combat/validate';
import { calculateAttack } from '../systems/combat/calculate';
import { applyAttack } from '../systems/combat/apply';
import { validateEndTurn } from '../systems/turn/validate';
import { calculateEndTurn } from '../systems/turn/calculate';
import { applyEndTurn } from '../systems/turn/apply';
import { validateSkill } from '../systems/skill/validate';
import { calculateSkill } from '../systems/skill/calculate';
import { applySkill } from '../systems/skill/apply';
import { applyVictory, checkVictory } from '../systems/victory/checkVictory';

function appendHistory(state: BattleState, action: BattleAction): BattleState {
  return {
    ...state,
    history: [...state.history, action],
  };
}

function finalizeState(
  state: BattleState,
  action: BattleAction,
  events: readonly BattleEvent[],
): ActionResult {
  const nextState = appendHistory(state, action);
  const victory = checkVictory(nextState);

  if (victory !== null && nextState.winner === null) {
    const victoryResult = applyVictory(nextState, victory);
    return {
      ok: true,
      state: victoryResult.state,
      events: [...events, ...victoryResult.events],
    };
  }

  return { ok: true, state: nextState, events };
}

export function dispatchAction(state: BattleState, action: BattleAction): ActionResult {
  switch (action.type) {
    case 'move': {
      const validation = validateMove(state, action);
      if (!validation.ok) return { ok: false, error: validation.error };

      const calculated = calculateMove(state, action, defaultRegistry);
      const { state: newState, events } = applyMove(state, action, calculated);
      return finalizeState(newState, action, events);
    }
    case 'attack': {
      const validation = validateAttack(state, action);
      if (!validation.ok) return { ok: false, error: validation.error };

      const calculated = calculateAttack(state, action);
      const { state: newState, events } = applyAttack(state, action, calculated);
      return finalizeState(newState, action, events);
    }
    case 'end_turn': {
      const validation = validateEndTurn(state, action);
      if (!validation.ok) return { ok: false, error: validation.error };

      const calculated = calculateEndTurn(state, action);
      const { state: newState, events } = applyEndTurn(state, action, calculated);
      return finalizeState(newState, action, events);
    }
    case 'skill': {
      const validation = validateSkill(state, action);
      if (!validation.ok) return { ok: false, error: validation.error };

      const calculated = calculateSkill(state, action);
      const { state: newState, events } = applySkill(state, action, calculated);
      return finalizeState(newState, action, events);
    }
    default:
      return { ok: false, error: { code: 'UnknownAction' } };
  }
}
