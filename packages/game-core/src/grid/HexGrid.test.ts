import { describe, expect, it } from 'vitest';
import { HexGrid } from './HexGrid';

describe('HexGrid', () => {
  it('creates 9x9 grid by default', () => {
    const grid = new HexGrid();
    expect(grid.width).toBe(9);
    expect(grid.height).toBe(9);
    expect(grid.getAllCells()).toHaveLength(81);
  });

  it('checks bounds', () => {
    const grid = new HexGrid();
    expect(grid.isInBounds({ q: 0, r: 0 })).toBe(true);
    expect(grid.isInBounds({ q: 9, r: 0 })).toBe(false);
  });
});
