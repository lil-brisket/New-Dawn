import type { BattleEvent, BattleState } from '@dawn/types';
import { withHp } from '../entities/Combatant';
import { updateMap } from '../utils/immutable';
import { applyVictory, checkVictory } from '../systems/victory/checkVictory';
import { dispatchAction } from '../battle/dispatchAction';

export type SandboxResult =
  | { readonly ok: true; readonly state: BattleState; readonly events: readonly BattleEvent[] }
  | { readonly ok: false; readonly error: string };

function applyVictoryIfNeeded(state: BattleState): SandboxResult {
  const victory = checkVictory(state);
  if (victory === null) {
    return { ok: true, state, events: [] };
  }
  const result = applyVictory(state, victory);
  return { ok: true, state: result.state, events: [...result.events] };
}

export function sandboxForceKill(state: BattleState, combatantId: string): SandboxResult {
  if (state.winner !== null) {
    return { ok: false, error: 'BattleOver' };
  }

  const combatant = state.combatants.get(combatantId);
  if (!combatant) {
    return { ok: false, error: 'CombatantNotFound' };
  }

  const killed = withHp(combatant, 0);
  const nextState: BattleState = {
    ...state,
    combatants: updateMap(state.combatants, combatantId, killed),
  };

  return applyVictoryIfNeeded(nextState);
}

export function sandboxForceHeal(
  state: BattleState,
  combatantId: string,
  hp?: number,
): SandboxResult {
  const combatant = state.combatants.get(combatantId);
  if (!combatant) {
    return { ok: false, error: 'CombatantNotFound' };
  }

  const healed = withHp(combatant, hp ?? combatant.maxHp);
  const nextState: BattleState = {
    ...state,
    combatants: updateMap(state.combatants, combatantId, healed),
    winner: state.winner !== null && healed.hp > 0 ? null : state.winner,
  };

  return { ok: true, state: nextState, events: [] };
}

export function sandboxAdvanceTurns(state: BattleState, count: number): SandboxResult {
  if (count <= 0) {
    return { ok: true, state, events: [] };
  }

  let current = state;
  const events: BattleEvent[] = [];

  for (let i = 0; i < count; i++) {
    if (current.winner !== null) break;
    const activeId = current.activeCombatantId;
    if (!activeId) break;

    const result = dispatchAction(current, { type: 'end_turn', combatantId: activeId });
    if (!result.ok) {
      return { ok: false, error: result.error.code };
    }
    current = result.state;
    events.push(...result.events);
  }

  return { ok: true, state: current, events };
}

export function sandboxSkipRound(state: BattleState): SandboxResult {
  if (state.winner !== null) {
    return { ok: false, error: 'BattleOver' };
  }

  const startRound = state.round;
  let current = state;
  const events: BattleEvent[] = [];
  let safety = state.turnOrder.length + 1;

  while (safety > 0 && current.winner === null && current.round === startRound) {
    const activeId = current.activeCombatantId;
    if (!activeId) break;

    const result = dispatchAction(current, { type: 'end_turn', combatantId: activeId });
    if (!result.ok) {
      return { ok: false, error: result.error.code };
    }
    current = result.state;
    events.push(...result.events);
    safety--;
  }

  return { ok: true, state: current, events };
}
