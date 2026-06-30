import type { BattleState, EndTurnAction } from '@dawn/types';
import { findNextLivingCombatant } from './validate';

export interface TurnCalculation {
  readonly nextCombatantId: string;
  readonly nextTurnIndex: number;
  readonly nextRound: number;
  readonly wrapped: boolean;
}

export function calculateEndTurn(state: BattleState, _action: EndTurnAction): TurnCalculation {
  const currentIndex = state.turn;
  const nextIndex = (currentIndex + 1) % state.turnOrder.length;
  const next = findNextLivingCombatant(state, nextIndex);

  const wrapped = nextIndex <= currentIndex;
  const nextRound = wrapped ? state.round + 1 : state.round;

  if (!next) {
    return {
      nextCombatantId: state.activeCombatantId ?? '',
      nextTurnIndex: currentIndex,
      nextRound,
      wrapped,
    };
  }

  return {
    nextCombatantId: next.combatantId,
    nextTurnIndex: next.turnIndex,
    nextRound,
    wrapped,
  };
}
