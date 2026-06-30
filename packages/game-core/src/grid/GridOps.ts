import type { Grid, HexCoord } from '@dawn/types';
import { coordToKey } from '../utils/coordKey';
import { add, distance } from './HexMath';
import { HEX_DIRECTIONS } from './HexDirection';

export function contains(grid: Grid, coord: HexCoord): boolean {
  return grid.tiles.has(coordToKey(coord));
}

export function getTile(grid: Grid, coord: HexCoord) {
  return grid.tiles.get(coordToKey(coord));
}

export function getNeighbors(grid: Grid, coord: HexCoord) {
  return HEX_DIRECTIONS.map((dir) => add(coord, dir))
    .filter((n) => contains(grid, n))
    .map((n) => getTile(grid, n)!);
}

export function gridDistance(grid: Grid, a: HexCoord, b: HexCoord): number {
  if (!contains(grid, a) || !contains(grid, b)) {
    return Infinity;
  }
  return distance(a, b);
}

export function ring(grid: Grid, center: HexCoord, radius: number): HexCoord[] {
  if (radius === 0) {
    return contains(grid, center) ? [center] : [];
  }

  const results: HexCoord[] = [];
  for (const tile of grid.tiles.values()) {
    const coord = tile.coord;
    if (distance(center, coord) === radius) {
      results.push(coord);
    }
  }
  return results;
}

export function spiral(grid: Grid, center: HexCoord, radius: number): HexCoord[] {
  const results: HexCoord[] = [];
  for (let r = 0; r <= radius; r++) {
    results.push(...ring(grid, center, r));
  }
  return results;
}

export function getAllCoords(grid: Grid): HexCoord[] {
  return Array.from(grid.tiles.values()).map((t) => t.coord);
}

export { offsetToCube, cubeToOffset } from './Grid';
