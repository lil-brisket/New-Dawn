import type { BattleConfig, BattleState, HexCoord } from '@dawn/types';
import { equals } from '../grid/HexMath';
import { findReachableTiles } from '../systems/movement/Pathfinder';
import { getCombatant } from './getActiveCombatant';
import { isCombatantAlive } from './isCombatantAlive';

export function getRemainingMoves(state: BattleState, config: BattleConfig): number {
  return Math.max(0, config.maxMoves - state.turnActionState.movesUsed);
}

export function getReachableTiles(state: BattleState, combatantId: string): HexCoord[] {
  const combatant = getCombatant(state, combatantId);
  if (!combatant || !isCombatantAlive(combatant)) return [];

  const { config } = state;
  const maxMovesByAp = Math.floor(combatant.ap / config.moveCost);
  const maxMoves = Math.min(combatant.movement, getRemainingMoves(state, config), maxMovesByAp);

  if (maxMoves <= 0) return [];

  return findReachableTiles(state, combatant.position, maxMoves);
}

export function canMoveTo(state: BattleState, combatantId: string, destination: HexCoord): boolean {
  return getReachableTiles(state, combatantId).some((c) => equals(c, destination));
}
