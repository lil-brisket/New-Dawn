import type { Combatant, HexCoord } from '@dawn/types';
import { createHex } from '@dawn/game-core';

export function createKnight(
  id: string,
  position: HexCoord,
  overrides?: Partial<Combatant>,
): Combatant {
  return {
    id,
    name: overrides?.name ?? 'Knight',
    team: 'player',
    position,
    hp: 100,
    maxHp: 100,
    sp: 50,
    maxSp: 50,
    attack: 20,
    defense: 8,
    movement: 3,
    ap: 30,
    maxAp: 30,
    level: 1,
    ...overrides,
  } as Combatant & { level: number };
}

export function createGoblin(
  id: string,
  position: HexCoord,
  overrides?: Partial<Combatant>,
): Combatant {
  return {
    id,
    name: overrides?.name ?? 'Goblin',
    team: 'enemy',
    position,
    hp: 40,
    maxHp: 40,
    sp: 20,
    maxSp: 20,
    attack: 12,
    defense: 3,
    movement: 3,
    ap: 30,
    maxAp: 30,
    level: 1,
    ...overrides,
  } as Combatant & { level: number };
}

export { createHex };
