import type { BattleState, HexCoord } from '@dawn/types';
import { equals } from '../grid/HexMath';
import { isCombatantAlive } from './isCombatantAlive';

export function getCombatantAt(state: BattleState, coord: HexCoord) {
  for (const combatant of state.combatants.values()) {
    if (isCombatantAlive(combatant) && equals(combatant.position, coord)) {
      return combatant;
    }
  }
  return undefined;
}

export function isTileOccupied(
  state: BattleState,
  coord: HexCoord,
  excludeCombatantId?: string,
): boolean {
  const combatant = getCombatantAt(state, coord);
  if (!combatant) return false;
  if (excludeCombatantId && combatant.id === excludeCombatantId) return false;
  return true;
}
