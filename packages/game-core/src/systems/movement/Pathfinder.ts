import type { BattleState, HexCoord } from '@dawn/types';
import { contains, getTile } from '../../grid/GridOps';
import { equals, neighbors } from '../../grid/HexMath';
import { coordToKey } from '../../utils/coordKey';
import { getCombatantAt } from '../../queries/getCombatantAt';
import { isCombatantAlive } from '../../queries/isCombatantAlive';

interface BfsNode {
  coord: HexCoord;
  cost: number;
  parent: HexCoord | null;
}

export function findReachableTiles(
  state: BattleState,
  start: HexCoord,
  maxCost: number,
): HexCoord[] {
  const { grid } = state;
  const visited = new Map<string, number>();
  const queue: BfsNode[] = [{ coord: start, cost: 0, parent: null }];
  const reachable: HexCoord[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    const key = coordToKey(node.coord);

    const prev = visited.get(key);
    if (prev !== undefined && prev <= node.cost) continue;
    visited.set(key, node.cost);

    if (node.cost > 0) {
      reachable.push(node.coord);
    }

    if (node.cost >= maxCost) continue;

    for (const next of neighbors(node.coord)) {
      if (!contains(grid, next)) continue;
      const tile = getTile(grid, next);
      if (!tile?.walkable) continue;

      const occupant = getCombatantAt(state, next);
      if (occupant && isCombatantAlive(occupant) && !equals(next, start)) continue;

      const nextCost = node.cost + 1;
      if (nextCost > maxCost) continue;

      queue.push({ coord: next, cost: nextCost, parent: node.coord });
    }
  }

  return reachable;
}

export function findPath(
  state: BattleState,
  start: HexCoord,
  goal: HexCoord,
  maxCost: number,
): HexCoord[] | null {
  const { grid } = state;
  const visited = new Map<string, { cost: number; parent: HexCoord | null }>();
  const queue: BfsNode[] = [{ coord: start, cost: 0, parent: null }];

  while (queue.length > 0) {
    const node = queue.shift()!;
    const key = coordToKey(node.coord);

    const prev = visited.get(key);
    if (prev !== undefined && prev.cost <= node.cost) continue;
    visited.set(key, { cost: node.cost, parent: node.parent });

    if (equals(node.coord, goal)) {
      return reconstructPath(visited, goal, start);
    }

    if (node.cost >= maxCost) continue;

    for (const next of neighbors(node.coord)) {
      if (!contains(grid, next)) continue;
      const tile = getTile(grid, next);
      if (!tile?.walkable) continue;

      const occupant = getCombatantAt(state, next);
      if (occupant && isCombatantAlive(occupant) && !equals(next, goal)) continue;

      const nextCost = node.cost + 1;
      if (nextCost > maxCost) continue;

      queue.push({ coord: next, cost: nextCost, parent: node.coord });
    }
  }

  return null;
}

function reconstructPath(
  visited: Map<string, { cost: number; parent: HexCoord | null }>,
  goal: HexCoord,
  start: HexCoord,
): HexCoord[] {
  const path: HexCoord[] = [];
  let current: HexCoord | null = goal;

  while (current && !equals(current, start)) {
    path.unshift(current);
    const entry = visited.get(coordToKey(current));
    current = entry?.parent ?? null;
  }

  return path;
}
