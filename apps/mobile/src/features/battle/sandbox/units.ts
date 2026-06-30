import type { Combatant, HexCoord } from '@dawn/types';
import { createCombatant, createHex } from '@dawn/game-core';
import { defaultRegistry } from '@dawn/game-data';

const DEFAULT_SKILL_IDS = [
  'skill_slash',
  'skill_fireball',
  'skill_shield_bash',
  'skill_arcane_burst',
] as const;

function combatantFromEnemy(
  id: string,
  position: HexCoord,
  overrides?: Partial<Combatant>,
): Combatant {
  const def = defaultRegistry.getEnemy(id);
  const stats = def?.baseStats;
  return createCombatant({
    id,
    name: def?.name ?? 'Enemy',
    team: 'enemy',
    position,
    hp: stats?.hp ?? 40,
    maxHp: stats?.maxHp ?? 40,
    sp: stats?.mp ?? 20,
    maxSp: stats?.maxMp ?? 20,
    attack: stats?.attack ?? 12,
    defense: stats?.defense ?? 3,
    movement: 3,
    ap: 30,
    maxAp: 30,
    skillIds: def?.skillIds ?? ['skill_slash'],
    ...overrides,
  });
}

function combatantFromCharacter(
  id: string,
  position: HexCoord,
  overrides?: Partial<Combatant>,
): Combatant {
  const def = defaultRegistry.getCharacter(id);
  const stats = def?.baseStats;
  return createCombatant({
    id,
    name: def?.name ?? 'Knight',
    team: 'player',
    position,
    hp: stats?.hp ?? 100,
    maxHp: stats?.maxHp ?? 100,
    sp: stats?.mp ?? 50,
    maxSp: stats?.maxMp ?? 50,
    attack: stats?.attack ?? 20,
    defense: stats?.defense ?? 8,
    movement: 3,
    ap: 30,
    maxAp: 30,
    skillIds: def?.skillIds ?? [...DEFAULT_SKILL_IDS],
    ...overrides,
  });
}

export function createKnight(
  id: string,
  position: HexCoord,
  overrides?: Partial<Combatant>,
): Combatant {
  return combatantFromCharacter('char_astra', position, {
    id,
    name: overrides?.name ?? 'Knight',
    ...overrides,
  });
}

export function createGoblin(
  id: string,
  position: HexCoord,
  overrides?: Partial<Combatant>,
): Combatant {
  return combatantFromEnemy('enemy_goblin', position, { id, ...overrides });
}

export function createSkillLabKnight(
  id: string,
  position: HexCoord,
  skillIds: readonly string[],
): Combatant {
  return createCombatant({
    id,
    name: 'Skill Tester',
    team: 'player',
    position,
    hp: 120,
    maxHp: 120,
    sp: 100,
    maxSp: 100,
    attack: 22,
    defense: 6,
    movement: 3,
    ap: 30,
    maxAp: 30,
    skillIds,
  });
}

export function createSkillLabAlly(id: string, position: HexCoord): Combatant {
  return createCombatant({
    id,
    name: 'Ally',
    team: 'player',
    position,
    hp: 80,
    maxHp: 80,
    sp: 30,
    maxSp: 30,
    attack: 10,
    defense: 5,
    movement: 2,
    ap: 30,
    maxAp: 30,
    skillIds: [],
  });
}

export { createHex };
