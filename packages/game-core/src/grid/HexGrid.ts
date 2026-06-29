import type { HexCell, HexCoord } from '@dawn/types';
import { hexToKey } from '@dawn/utils';
import { GRID_CONSTANTS } from '../constants/GridConstants';

export class HexGrid {
  readonly width: number;
  readonly height: number;
  private cells: Map<string, HexCell>;

  constructor(width = GRID_CONSTANTS.SIZE, height = GRID_CONSTANTS.SIZE) {
    this.width = width;
    this.height = height;
    this.cells = new Map();
    this.initializeCells();
  }

  private initializeCells(): void {
    for (let q = 0; q < this.width; q++) {
      for (let r = 0; r < this.height; r++) {
        const coord = { q, r };
        this.cells.set(hexToKey(coord), {
          coord,
          walkable: true,
          elevation: 0,
          terrainId: GRID_CONSTANTS.DEFAULT_TERRAIN,
        });
      }
    }
  }

  getCell(coord: HexCoord): HexCell | undefined {
    return this.cells.get(hexToKey(coord));
  }

  isInBounds(coord: HexCoord): boolean {
    return coord.q >= 0 && coord.q < this.width && coord.r >= 0 && coord.r < this.height;
  }

  isWalkable(coord: HexCoord): boolean {
    const cell = this.getCell(coord);
    return cell?.walkable ?? false;
  }

  getAllCells(): HexCell[] {
    return Array.from(this.cells.values());
  }
}

export type { HexCell };
