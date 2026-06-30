import type { BattleState, HexCoord } from '@dawn/types';
import { ring } from '../grid/GridOps';
import { getCombatant } from './getActiveCombatant';
import { isCombatantAlive } from './isCombatantAlive';

/** Tiles within attack range of a combatant (excludes the combatant's tile). */
export function getAttackRangeTiles(state: BattleState, combatantId: string): HexCoord[] {
  if (state.winner !== null) return [];

  const combatant = getCombatant(state, combatantId);
  if (!combatant || !isCombatantAlive(combatant)) return [];
  if (state.activeCombatantId !== combatantId) return [];

  const tiles: HexCoord[] = [];
  for (let radius = 1; radius <= state.config.attackRange; radius++) {
    tiles.push(...ring(state.grid, combatant.position, radius));
  }
  return tiles;
}
