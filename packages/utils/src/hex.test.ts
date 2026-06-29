import { describe, expect, it } from 'vitest';
import { hexDistance, hexNeighbors, hexEquals } from './hex';
import { SeededRandom } from './random';

describe('hex', () => {
  it('calculates distance between same cell as 0', () => {
    expect(hexDistance({ q: 0, r: 0 }, { q: 0, r: 0 })).toBe(0);
  });

  it('returns 6 neighbors', () => {
    expect(hexNeighbors({ q: 0, r: 0 })).toHaveLength(6);
  });

  it('compares coordinates', () => {
    expect(hexEquals({ q: 1, r: 2 }, { q: 1, r: 2 })).toBe(true);
  });
});

describe('SeededRandom', () => {
  it('is reproducible with same seed', () => {
    const a = new SeededRandom(42);
    const b = new SeededRandom(42);
    expect(a.next()).toBe(b.next());
  });
});
