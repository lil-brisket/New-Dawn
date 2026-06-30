import type { AbilityContext } from '../AbilityContext';
import { withPosition } from '../../../entities/Combatant';
import { getCombatant } from '../../../queries/getActiveCombatant';
import { isTileOccupied } from '../../../queries/getCombatantAt';
import { updateMap } from '../../../utils/immutable';
import { distance, neighbors } from '../../../grid/HexMath';
import { contains, getTile } from '../../../grid/GridOps';
import { findPath } from '../../movement/Pathfinder';

export function resolveChargeEffect(ctx: AbilityContext, targetId: string): void {
  const source = getCombatant(ctx.battle, ctx.source.id);
  const target = getCombatant(ctx.battle, targetId);
  if (!source || !target) return;

  const adjacentTiles = neighbors(target.position).filter((coord) => {
    if (!contains(ctx.battle.grid, coord)) return false;
    const tile = getTile(ctx.battle.grid, coord);
    if (!tile?.walkable) return false;
    return !isTileOccupied(ctx.battle, coord, source.id);
  });

  if (adjacentTiles.length === 0) return;

  let bestTile = adjacentTiles[0]!;
  let bestDist = Infinity;

  for (const tile of adjacentTiles) {
    const path = findPath(ctx.battle, source.position, tile, 10);
    if (!path || path.length === 0) continue;
    const pathDist = path.length - 1;
    if (pathDist < bestDist) {
      bestDist = pathDist;
      bestTile = tile;
    }
  }

  if (bestDist === Infinity) return;
  if (distance(source.position, target.position) <= 1) {
    return;
  }

  const from = source.position;
  const updated = withPosition(source, bestTile);
  ctx.battle = {
    ...ctx.battle,
    combatants: updateMap(ctx.battle.combatants, source.id, updated),
  };

  ctx.events.push({
    type: 'combatant_moved',
    combatantId: source.id,
    from,
    to: bestTile,
  });
}
