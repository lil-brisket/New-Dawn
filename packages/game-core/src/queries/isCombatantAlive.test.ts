import { describe, expect, it } from 'vitest';
import { createCombatant } from '../entities/Combatant';
import { isCombatantAlive } from './isCombatantAlive';

describe('isCombatantAlive', () => {
  it('returns true when hp > 0', () => {
    const combatant = createCombatant({
      id: 'c1',
      name: 'Test',
      team: 'player',
      position: { x: 0, y: 0, z: 0 },
      hp: 1,
      maxHp: 100,
      sp: 0,
      maxSp: 0,
      attack: 10,
      defense: 5,
      movement: 3,
      ap: 30,
      maxAp: 30,
    });
    expect(isCombatantAlive(combatant)).toBe(true);
  });

  it('returns false when hp is 0', () => {
    const combatant = createCombatant({
      id: 'c1',
      name: 'Test',
      team: 'player',
      position: { x: 0, y: 0, z: 0 },
      hp: 0,
      maxHp: 100,
      sp: 0,
      maxSp: 0,
      attack: 10,
      defense: 5,
      movement: 3,
      ap: 30,
      maxAp: 30,
    });
    expect(isCombatantAlive(combatant)).toBe(false);
  });
});
