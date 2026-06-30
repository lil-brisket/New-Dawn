import { offsetToCube } from '@dawn/game-core';
import type { HexCoord } from '@dawn/types';

/** 0-based column and row — matches axis labels (A1 = col 0, row 0). */
export function gridTile(col: number, row: number): HexCoord {
  return offsetToCube(col, row);
}

/** Player line — west side of the grid. */
export function playerLine(count: number, startCol: number, row: number): HexCoord[] {
  return Array.from({ length: count }, (_, index) => gridTile(startCol + index, row));
}

/** Staggered player wedge (e.g. 3 units). */
export function playerWedge(cols: readonly number[], rows: readonly number[]): HexCoord[] {
  return cols.map((col, index) => gridTile(col, rows[index]!));
}

/** Enemy line — east side of the grid. */
export function enemyLine(count: number, endCol: number, row: number): HexCoord[] {
  return Array.from({ length: count }, (_, index) => gridTile(endCol - (count - 1 - index), row));
}

/** Staggered enemy wedge mirroring player wedge. */
export function enemyWedge(cols: readonly number[], rows: readonly number[]): HexCoord[] {
  return cols.map((col, index) => gridTile(col, rows[index]!));
}
