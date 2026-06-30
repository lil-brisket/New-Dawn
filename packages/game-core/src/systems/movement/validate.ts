import type { BattleError, BattleState, MoveAction } from '@dawn/types';
import type { Result } from '@dawn/utils';
import { err, ok } from '@dawn/utils';
import { defaultRegistry } from '@dawn/game-data';
import { contains, getTile } from '../../grid/GridOps';
import { equals } from '../../grid/HexMath';
import { getCombatant } from '../../queries/getActiveCombatant';
import { canMoveTo } from '../../queries/getReachableTiles';
import { isTileOccupied } from '../../queries/getCombatantAt';
import { isCombatantAlive } from '../../queries/isCombatantAlive';
import { isStunned } from '../status/hasControlEffect';

export function validateMove(state: BattleState, action: MoveAction): Result<void, BattleError> {
  if (state.winner !== null) {
    return err({ code: 'BattleOver' });
  }

  if (state.activeCombatantId !== action.combatantId) {
    return err({ code: 'WrongTurn' });
  }

  const combatant = getCombatant(state, action.combatantId);
  if (!combatant) {
    return err({ code: 'CombatantNotFound' });
  }

  if (!isCombatantAlive(combatant)) {
    return err({ code: 'DeadCombatant' });
  }

  if (isStunned(combatant, defaultRegistry)) {
    return err({ code: 'Stunned' });
  }

  const { config } = state;
  if (state.turnActionState.movesUsed >= config.maxMoves) {
    return err({ code: 'MaxMovesReached' });
  }

  if (combatant.ap < config.moveCost) {
    return err({ code: 'InsufficientAp' });
  }

  if (!contains(state.grid, action.destination)) {
    return err({ code: 'OutOfRange' });
  }

  const tile = getTile(state.grid, action.destination);
  if (!tile?.walkable) {
    return err({ code: 'NotWalkable' });
  }

  if (isTileOccupied(state, action.destination, action.combatantId)) {
    return err({ code: 'TileOccupied' });
  }

  if (!canMoveTo(state, action.combatantId, action.destination)) {
    return err({ code: 'OutOfRange' });
  }

  if (equals(combatant.position, action.destination)) {
    return err({ code: 'OutOfRange' });
  }

  return ok(undefined);
}
