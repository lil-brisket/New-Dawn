import { describe, expect, it } from 'vitest';
import { createHex } from '../../../grid/HexCoord';
import { createGrid } from '../../../grid/Grid';
import { createCombatant } from '../../../entities/Combatant';
import { createBattle } from '../../../battle/createBattle';
import { defaultRegistry } from '@dawn/game-data';
import { canTarget, getTargetTiles, getValidTargets, preview } from './index';

function setup() {
  const grid = createGrid({ width: 8, height: 8 });
  const player = createCombatant({
    id: 'player',
    name: 'Knight',
    team: 'player',
    position: createHex(0, 0),
    hp: 100,
    maxHp: 100,
    sp: 100,
    maxSp: 100,
    attack: 20,
    defense: 5,
    movement: 3,
    ap: 30,
    maxAp: 30,
    skillIds: ['skill_slash', 'skill_blink', 'skill_mend'],
  });
  const enemy = createCombatant({
    id: 'enemy',
    name: 'Goblin',
    team: 'enemy',
    position: createHex(1, -1),
    hp: 100,
    maxHp: 100,
    sp: 20,
    maxSp: 20,
    attack: 10,
    defense: 3,
    movement: 3,
    ap: 30,
    maxAp: 30,
    skillIds: [],
  });
  const battle = createBattle({ player, enemies: [enemy], grid });
  expect(battle.ok).toBe(true);
  return { state: battle.ok ? battle.state : null!, enemy };
}

describe('targeting queries', () => {
  it('getValidTargets returns enemies in range for slash', () => {
    const { state } = setup();
    const skill = defaultRegistry.getSkill('skill_slash')!;
    const targets = getValidTargets(state, skill, 'player');
    expect(targets).toContain('enemy');
  });

  it('canTarget validates enemy for slash', () => {
    const { state, enemy } = setup();
    const skill = defaultRegistry.getSkill('skill_slash')!;
    expect(canTarget(state, skill, 'player', { targetId: enemy.id })).toBe(true);
  });

  it('getTargetTiles returns tiles for blink', () => {
    const { state } = setup();
    const skill = defaultRegistry.getSkill('skill_blink')!;
    const tiles = getTargetTiles(state, skill, 'player');
    expect(tiles.length).toBeGreaterThan(0);
  });

  it('preview returns simulation for slash', () => {
    const { state, enemy } = setup();
    const result = preview(state, 'skill_slash', 'player', { targetId: enemy.id });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.damage.get(enemy.id)).toBeGreaterThan(0);
  });
});
