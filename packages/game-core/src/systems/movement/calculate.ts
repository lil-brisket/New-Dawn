import type { BattleState, HexCoord, MoveAction } from '@dawn/types';
import { findPath } from './Pathfinder';
import { getCombatant } from '../../queries/getActiveCombatant';
import { getRemainingMoves } from '../../queries/getReachableTiles';

export interface MoveCalculation {
  readonly path: readonly HexCoord[];
  readonly apCost: number;
}

export function calculateMove(state: BattleState, action: MoveAction): MoveCalculation {
  const combatant = getCombatant(state, action.combatantId)!;
  const { config } = state;
  const maxMoves = Math.min(
    combatant.movement,
    getRemainingMoves(state, config),
    Math.floor(combatant.ap / config.moveCost),
  );

  const path = findPath(state, combatant.position, action.destination, maxMoves) ?? [
    action.destination,
  ];

  return {
    path,
    apCost: config.moveCost,
  };
}
