import { describe, expect, it } from 'vitest';
import { createHex } from './HexCoord';
import { createGrid, offsetToCube } from './Grid';
import { contains, getNeighbors, gridDistance, ring, spiral } from './GridOps';

describe('GridOps', () => {
  const grid5x5 = createGrid({ width: 5, height: 5 });
  const center = offsetToCube(2, 2);

  it('contains returns true for tiles in grid', () => {
    expect(contains(grid5x5, center)).toBe(true);
  });

  it('contains returns false for out-of-bounds coords', () => {
    expect(contains(grid5x5, createHex(100, -100))).toBe(false);
  });

  it('getNeighbors returns walkable adjacent tiles', () => {
    const neighborTiles = getNeighbors(grid5x5, center);
    expect(neighborTiles.length).toBeGreaterThan(0);
    expect(neighborTiles.length).toBeLessThanOrEqual(6);
  });

  it('gridDistance matches hex distance within grid', () => {
    const neighbors = getNeighbors(grid5x5, center);
    if (neighbors.length > 0) {
      const target = neighbors[0]!.coord;
      expect(gridDistance(grid5x5, center, target)).toBe(1);
    }
  });

  it('ring at radius 0 returns center', () => {
    expect(ring(grid5x5, center, 0)).toEqual([center]);
  });

  it('ring at radius 1 returns adjacent tiles', () => {
    const r1 = ring(grid5x5, center, 1);
    expect(r1.length).toBeGreaterThan(0);
    for (const coord of r1) {
      expect(gridDistance(grid5x5, center, coord)).toBe(1);
    }
  });

  it('spiral includes center and expands outward', () => {
    const coords = spiral(grid5x5, center, 2);
    expect(coords[0]).toEqual(center);
    expect(coords.length).toBeGreaterThan(1);
  });

  it('supports arbitrary grid sizes', () => {
    const grid12x8 = createGrid({ width: 12, height: 8 });
    expect(grid12x8.width).toBe(12);
    expect(grid12x8.height).toBe(8);
    expect(grid12x8.tiles.size).toBe(96);
  });
});
