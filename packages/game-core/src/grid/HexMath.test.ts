import { describe, expect, it } from 'vitest';
import { createHex } from './HexCoord';
import {
  add,
  direction,
  distance,
  equals,
  lerp,
  line,
  neighbors,
  round,
  scale,
  subtract,
} from './HexMath';

describe('HexMath', () => {
  const origin = createHex(0, 0);
  const a = createHex(2, -1);
  const b = createHex(-1, 2);

  it('equals detects same coordinates', () => {
    expect(equals(a, { x: 2, y: -1, z: -1 })).toBe(true);
    expect(equals(a, b)).toBe(false);
  });

  it('add and subtract are inverses', () => {
    const sum = add(a, b);
    expect(subtract(sum, b)).toEqual(a);
  });

  it('scale multiplies all components', () => {
    expect(scale(a, 2)).toEqual({ x: 4, y: -2, z: -2 });
  });

  it('distance is zero for same hex', () => {
    expect(distance(a, a)).toBe(0);
  });

  it('distance between neighbors is 1', () => {
    const n = neighbors(origin)[0]!;
    expect(distance(origin, n)).toBe(1);
  });

  it('distance for known hexes', () => {
    expect(distance(createHex(0, 0), createHex(3, -2))).toBe(3);
  });

  it('neighbors returns 6 adjacent hexes', () => {
    expect(neighbors(origin)).toHaveLength(6);
    for (const n of neighbors(origin)) {
      expect(n.x + n.y + n.z).toBe(0);
      expect(distance(origin, n)).toBe(1);
    }
  });

  it('direction returns unit direction between adjacent hexes', () => {
    const n = neighbors(origin)[0]!;
    expect(direction(origin, n)).toEqual(n);
  });

  it('direction returns null for same hex', () => {
    expect(direction(origin, origin)).toBeNull();
  });

  it('lerp interpolates between hexes', () => {
    const mid = lerp(origin, a, 0.5);
    expect(mid.x).toBeCloseTo(1);
    expect(mid.y).toBeCloseTo(-0.5);
  });

  it('round snaps fractional cube coords', () => {
    const result = round({ x: 0.4, y: -0.2, z: -0.2 });
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
    expect(result.z).toBe(0);
  });

  it('line includes endpoints', () => {
    const path = line(origin, createHex(2, -2));
    expect(path[0]).toEqual(origin);
    expect(path[path.length - 1]).toEqual(createHex(2, -2));
    expect(path.length).toBe(3);
  });

  it('line for same hex returns single element', () => {
    expect(line(origin, origin)).toEqual([origin]);
  });
});
