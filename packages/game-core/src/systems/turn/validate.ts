import type { BattleError, BattleState, Combatant, EndTurnAction } from '@dawn/types';
import type { Result } from '@dawn/utils';
import { err, ok } from '@dawn/utils';
import { getCombatant } from '../../queries/getActiveCombatant';
import { isCombatantAlive } from '../../queries/isCombatantAlive';

export function validateEndTurn(
  state: BattleState,
  action: EndTurnAction,
): Result<void, BattleError> {
  if (state.winner !== null) {
    return err({ code: 'BattleOver' });
  }

  if (state.activeCombatantId !== action.combatantId) {
    return err({ code: 'WrongTurn' });
  }

  const combatant = getCombatant(state, action.combatantId);
  if (!combatant) {
    return err({ code: 'CombatantNotFound' });
  }

  if (!isCombatantAlive(combatant)) {
    return err({ code: 'DeadCombatant' });
  }

  return ok(undefined);
}

/** Party members first, then enemies in order. */
export function createTurnOrder(
  party: readonly Combatant[],
  enemies: readonly Combatant[],
): string[] {
  return [...party.map((p) => p.id), ...enemies.map((e) => e.id)];
}

export function findNextLivingCombatant(
  state: BattleState,
  startIndex: number,
): { combatantId: string; turnIndex: number } | null {
  const { turnOrder } = state;
  if (turnOrder.length === 0) return null;

  for (let i = 0; i < turnOrder.length; i++) {
    const index = (startIndex + i) % turnOrder.length;
    const combatantId = turnOrder[index]!;
    const combatant = state.combatants.get(combatantId);
    if (combatant && isCombatantAlive(combatant)) {
      return { combatantId, turnIndex: index };
    }
  }

  return null;
}
