import { describe, expect, it } from 'vitest';
import { calculateDamage } from './Damage';

describe('Damage', () => {
  it('returns at least 1 damage', () => {
    expect(calculateDamage(5, 10)).toBe(1);
  });

  it('subtracts defense from attack', () => {
    expect(calculateDamage(20, 10)).toBe(10);
  });

  it('returns 1 when attack equals defense', () => {
    expect(calculateDamage(10, 10)).toBe(1);
  });
});
