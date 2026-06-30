import type { Grid, HexCoord, Tile } from '@dawn/types';
import { createHex } from './HexCoord';
import { coordToKey } from '../utils/coordKey';

export type { Grid, Tile };

export interface CreateGridOptions {
  readonly width: number;
  readonly height: number;
  readonly tiles?: readonly Tile[];
}

/** Convert offset coordinates (col, row) to cube hex for odd-r layout */
export function offsetToCube(col: number, row: number): HexCoord {
  const x = col - (row - (row & 1)) / 2;
  const z = row;
  const y = -x - z;
  return { x, y, z };
}

/** Convert cube hex to offset coordinates (col, row) for odd-r layout */
export function cubeToOffset(coord: HexCoord): { col: number; row: number } {
  const col = coord.x + (coord.z - (coord.z & 1)) / 2;
  const row = coord.z;
  return { col, row };
}

export function createGrid(options: CreateGridOptions): Grid {
  const { width, height, tiles } = options;

  if (tiles) {
    const tileMap = new Map<string, Tile>();
    for (const tile of tiles) {
      tileMap.set(coordToKey(tile.coord), tile);
    }
    return { width, height, tiles: tileMap };
  }

  const tileMap = new Map<string, Tile>();
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const coord = offsetToCube(col, row);
      tileMap.set(coordToKey(coord), { coord, walkable: true });
    }
  }

  return { width, height, tiles: tileMap };
}

export function createGridFromCoords(coords: readonly HexCoord[]): Grid {
  if (coords.length === 0) {
    return { width: 0, height: 0, tiles: new Map() };
  }

  let minCol = Infinity;
  let maxCol = -Infinity;
  let minRow = Infinity;
  let maxRow = -Infinity;

  for (const coord of coords) {
    const { col, row } = cubeToOffset(coord);
    minCol = Math.min(minCol, col);
    maxCol = Math.max(maxCol, col);
    minRow = Math.min(minRow, row);
    maxRow = Math.max(maxRow, row);
  }

  const tileMap = new Map<string, Tile>();
  for (const coord of coords) {
    tileMap.set(coordToKey(coord), { coord, walkable: true });
  }

  return {
    width: maxCol - minCol + 1,
    height: maxRow - minRow + 1,
    tiles: tileMap,
  };
}

export { createHex };
