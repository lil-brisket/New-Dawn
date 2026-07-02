import type { BattleAction, BattleState } from '@dawn/types';
import { defaultRegistry } from '@dawn/game-data';
import { getActiveCombatant } from '../queries/getActiveCombatant';
import { isStunned } from '../systems/tag/hasControlEffect';

/** When the active unit cannot act, end their turn immediately. */
export function planStunnedSkip(state: BattleState): BattleAction[] | null {
  const active = getActiveCombatant(state);
  if (!active || active.team !== 'enemy' || state.winner !== null) {
    return null;
  }
  if (!isStunned(active, defaultRegistry)) {
    return null;
  }
  return [{ type: 'end_turn', combatantId: active.id }];
}
