import type { BattleError, BattleState, Combatant, Grid } from '@dawn/types';
import type { Result } from '@dawn/utils';
import { err, ok } from '@dawn/utils';
import { contains, getTile } from '../grid/GridOps';
import { coordToKey } from '../utils/coordKey';

export function validateCombatantSpawns(
  grid: Grid,
  combatants: readonly Combatant[],
): Result<void, BattleError> {
  const occupied = new Set<string>();

  for (const combatant of combatants) {
    const { position } = combatant;

    if (!contains(grid, position)) {
      return err({ code: 'InvalidBattleSetup' });
    }

    const tile = getTile(grid, position);
    if (!tile?.walkable) {
      return err({ code: 'InvalidBattleSetup' });
    }

    const key = coordToKey(position);
    if (occupied.has(key)) {
      return err({ code: 'InvalidBattleSetup' });
    }
    occupied.add(key);
  }

  return ok(undefined);
}

export function validateBattleSpawns(
  state: Pick<BattleState, 'grid' | 'combatants'>,
): Result<void, BattleError> {
  return validateCombatantSpawns(state.grid, [...state.combatants.values()]);
}
