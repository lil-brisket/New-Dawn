import type { BattleState } from '@dawn/types';

export function cloneBattleState(state: BattleState): BattleState {
  const combatants = new Map(state.combatants);
  return {
    ...state,
    combatants,
    turnActionState: { ...state.turnActionState },
    turnOrder: [...state.turnOrder],
    history: [...state.history],
  };
}
