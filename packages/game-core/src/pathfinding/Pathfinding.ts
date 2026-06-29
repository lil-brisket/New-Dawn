import type { HexCoord } from '@dawn/types';
import { hexDistance, hexNeighbors, hexToKey } from '@dawn/utils';
import type { HexGrid } from '../grid/HexGrid';

export function findPath(
  grid: HexGrid,
  start: HexCoord,
  goal: HexCoord,
  occupied: Set<string> = new Set(),
): HexCoord[] {
  if (!grid.isInBounds(start) || !grid.isInBounds(goal)) return [];
  if (!grid.isWalkable(goal) && hexToKey(start) !== hexToKey(goal)) return [];

  const open: HexCoord[] = [start];
  const cameFrom = new Map<string, HexCoord>();
  const gScore = new Map<string, number>();
  gScore.set(hexToKey(start), 0);

  while (open.length > 0) {
    open.sort(
      (a, b) =>
        (gScore.get(hexToKey(a)) ?? Infinity) +
        hexDistance(a, goal) -
        ((gScore.get(hexToKey(b)) ?? Infinity) + hexDistance(b, goal)),
    );
    const current = open.shift()!;

    if (hexToKey(current) === hexToKey(goal)) {
      return reconstructPath(cameFrom, current);
    }

    for (const neighbor of hexNeighbors(current)) {
      if (!grid.isInBounds(neighbor) || !grid.isWalkable(neighbor)) continue;
      const key = hexToKey(neighbor);
      if (occupied.has(key) && key !== hexToKey(goal)) continue;

      const tentative = (gScore.get(hexToKey(current)) ?? Infinity) + 1;
      if (tentative < (gScore.get(key) ?? Infinity)) {
        cameFrom.set(key, current);
        gScore.set(key, tentative);
        if (!open.some((c) => hexToKey(c) === key)) {
          open.push(neighbor);
        }
      }
    }
  }

  return [];
}

function reconstructPath(cameFrom: Map<string, HexCoord>, current: HexCoord): HexCoord[] {
  const path: HexCoord[] = [current];
  let key = hexToKey(current);
  while (cameFrom.has(key)) {
    const prev = cameFrom.get(key)!;
    path.unshift(prev);
    key = hexToKey(prev);
  }
  return path;
}
