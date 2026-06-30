import type { BattleState, Combatant, HexCoord, Team } from '@dawn/types';
import type { AreaTeamFilter } from '@dawn/types';
import { distance } from '../../../grid/HexMath';
import { spiral } from '../../../grid/GridOps';
import { isCombatantAlive } from '../../../queries/isCombatantAlive';
import { isAlly, isEnemy } from '../../../entities/Team';

export function getTilesInRadius(
  grid: BattleState['grid'],
  center: HexCoord,
  radius: number,
): HexCoord[] {
  return spiral(grid, center, radius);
}

export function matchesAreaFilter(
  sourceTeam: Team,
  combatant: Combatant,
  filter: AreaTeamFilter,
): boolean {
  switch (filter) {
    case 'enemy':
      return isEnemy(sourceTeam, combatant.team);
    case 'ally':
      return isAlly(sourceTeam, combatant.team);
    case 'all':
      return true;
    default:
      return false;
  }
}

export function getCombatantsInRadius(
  state: BattleState,
  center: HexCoord,
  radius: number,
  filter: AreaTeamFilter,
  sourceTeam: Team,
): Combatant[] {
  const results: Combatant[] = [];

  for (const combatant of state.combatants.values()) {
    if (!isCombatantAlive(combatant)) continue;
    if (distance(center, combatant.position) > radius) continue;
    if (!matchesAreaFilter(sourceTeam, combatant, filter)) continue;
    results.push(combatant);
  }

  return results;
}
