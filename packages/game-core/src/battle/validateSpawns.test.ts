import { describe, expect, it } from 'vitest';
import type { Combatant } from '@dawn/types';
import { createHex } from '../grid/HexCoord';
import { createGrid, offsetToCube } from '../grid/Grid';
import { createCombatant } from '../entities/Combatant';
import { createBattle } from './createBattle';
import { validateCombatantSpawns } from './validateSpawns';

function makeCombatant(
  overrides: Partial<Combatant> & Pick<Combatant, 'id' | 'team' | 'position'>,
): Combatant {
  return createCombatant({
    name: overrides.id,
    hp: 100,
    maxHp: 100,
    sp: 50,
    maxSp: 50,
    attack: 20,
    defense: 5,
    movement: 3,
    ap: 30,
    maxAp: 30,
    ...overrides,
  });
}

describe('validateCombatantSpawns', () => {
  const grid = createGrid({ width: 8, height: 8 });

  it('accepts in-bounds walkable unique tiles', () => {
    const units = [
      makeCombatant({ id: 'a', team: 'player', position: offsetToCube(1, 3) }),
      makeCombatant({ id: 'b', team: 'enemy', position: offsetToCube(6, 3) }),
    ];
    expect(validateCombatantSpawns(grid, units).ok).toBe(true);
  });

  it('rejects out-of-bounds positions', () => {
    const units = [makeCombatant({ id: 'a', team: 'player', position: createHex(1, 0) })];
    expect(validateCombatantSpawns(grid, units).ok).toBe(false);
  });

  it('rejects overlapping spawns', () => {
    const tile = offsetToCube(2, 2);
    const units = [
      makeCombatant({ id: 'a', team: 'player', position: tile }),
      makeCombatant({ id: 'b', team: 'enemy', position: tile }),
    ];
    expect(validateCombatantSpawns(grid, units).ok).toBe(false);
  });

  it('createBattle rejects invalid spawns', () => {
    const result = createBattle({
      party: [makeCombatant({ id: 'p1', team: 'player', position: createHex(1, 0) })],
      enemies: [makeCombatant({ id: 'e1', team: 'enemy', position: offsetToCube(6, 3) })],
      grid,
    });
    expect(result.ok).toBe(false);
  });
});
