import type { BattleState, HexCoord } from '@dawn/types';
import { hexFromKey } from '@dawn/utils';
import { findReachableTilesWithCosts } from '../systems/movement/Pathfinder';
import { getCombatant } from './getActiveCombatant';
import { getRemainingMoves } from './getReachableTiles';
import { isCombatantAlive } from './isCombatantAlive';

export interface ReachableTileCost {
  readonly coord: HexCoord;
  readonly steps: number;
  readonly apCost: number;
}

export function getReachableTileCosts(
  state: BattleState,
  combatantId: string,
): ReachableTileCost[] {
  const combatant = getCombatant(state, combatantId);
  if (!combatant || !isCombatantAlive(combatant)) return [];

  const { config } = state;
  const maxMovesByAp = Math.floor(combatant.ap / config.moveCost);
  const maxMoves = Math.min(combatant.movement, getRemainingMoves(state, config), maxMovesByAp);

  if (maxMoves <= 0) return [];

  const stepCosts = findReachableTilesWithCosts(state, combatant.position, maxMoves);
  const results: ReachableTileCost[] = [];

  for (const [key, steps] of stepCosts) {
    const coord = hexFromKey(key);
    results.push({
      coord,
      steps,
      apCost: steps * config.moveCost,
    });
  }

  return results;
}
