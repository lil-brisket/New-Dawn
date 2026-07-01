import type { BattleState, HexCoord, MoveAction } from '@dawn/types';
import type { DefinitionRegistry } from '@dawn/game-data';
import { findPath } from './Pathfinder';
import { getCombatant } from '../../queries/getActiveCombatant';
import { getEffectiveMovement } from '../status/getEffectiveMovement';
import { getRemainingMoves } from '../../queries/getReachableTiles';

export interface MoveCalculation {
  readonly path: readonly HexCoord[];
  readonly apCost: number;
}

export function calculateMove(
  state: BattleState,
  action: MoveAction,
  registry?: DefinitionRegistry,
): MoveCalculation {
  const combatant = getCombatant(state, action.combatantId)!;
  const { config } = state;
  const effectiveMovement = registry
    ? getEffectiveMovement(combatant, registry)
    : combatant.movement;
  const maxMoves = Math.min(
    effectiveMovement,
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
