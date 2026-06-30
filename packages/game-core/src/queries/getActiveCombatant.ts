import type { BattleState, Combatant } from '@dawn/types';

export function getCombatant(state: BattleState, combatantId: string): Combatant | undefined {
  return state.combatants.get(combatantId);
}

export function getActiveCombatant(state: BattleState): Combatant | undefined {
  if (!state.activeCombatantId) return undefined;
  return state.combatants.get(state.activeCombatantId);
}

export function isPlayerTurn(state: BattleState): boolean {
  return state.activeCombatantId === state.playerId;
}
