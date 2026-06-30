import { describe, expect, it } from 'vitest';
import { createHex } from '../../../grid/HexCoord';
import { createGrid } from '../../../grid/Grid';
import { createCombatant } from '../../../entities/Combatant';
import { createBattle } from '../../../battle/createBattle';
import { dispatchAction } from '../../../battle/dispatchAction';
import { defaultRegistry } from '@dawn/game-data';
import {
  canTarget,
  getAffectedTiles,
  getAreaAffectedCombatants,
  getValidTargets,
  preview,
  resolveSkillTargets,
} from './index';

function setupCluster() {
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
    skillIds: ['skill_arcane_burst', 'skill_meteor', 'skill_healing_rain'],
  });
  const enemy1 = createCombatant({
    id: 'e1',
    name: 'Goblin 1',
    team: 'enemy',
    position: createHex(1, -1),
    hp: 100,
    maxHp: 100,
    sp: 0,
    maxSp: 0,
    attack: 10,
    defense: 3,
    movement: 3,
    ap: 30,
    maxAp: 30,
    skillIds: [],
  });
  const enemy2 = createCombatant({
    id: 'e2',
    name: 'Goblin 2',
    team: 'enemy',
    position: createHex(2, -2),
    hp: 100,
    maxHp: 100,
    sp: 0,
    maxSp: 0,
    attack: 10,
    defense: 3,
    movement: 3,
    ap: 30,
    maxAp: 30,
    skillIds: [],
  });
  const ally = createCombatant({
    id: 'ally',
    name: 'Ally',
    team: 'player',
    position: createHex(0, -1),
    hp: 50,
    maxHp: 100,
    sp: 30,
    maxSp: 30,
    attack: 10,
    defense: 4,
    movement: 2,
    ap: 30,
    maxAp: 30,
    skillIds: [],
  });
  const battle = createBattle({ party: [player, ally], enemies: [enemy1, enemy2], grid });
  expect(battle.ok).toBe(true);
  return { state: battle.ok ? battle.state : null!, enemy1, enemy2, ally };
}

describe('area targeting', () => {
  it('arcane burst hits multiple enemies in radius', () => {
    const { state, enemy1 } = setupCluster();
    const skill = defaultRegistry.getSkill('skill_arcane_burst')!;

    const targets = resolveSkillTargets(state, skill, 'player', { targetId: enemy1.id });
    expect(targets.targets.length).toBeGreaterThanOrEqual(2);

    const result = dispatchAction(state, {
      type: 'skill',
      combatantId: 'player',
      skillId: 'skill_arcane_burst',
      targetId: enemy1.id,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.events.filter((e) => e.type === 'damage_dealt').length).toBeGreaterThanOrEqual(2);
  });

  it('meteor hits enemies on selected tile', () => {
    const { state, enemy1 } = setupCluster();
    const skill = defaultRegistry.getSkill('skill_meteor')!;

    expect(canTarget(state, skill, 'player', { destination: enemy1.position })).toBe(true);

    const affected = getAreaAffectedCombatants(state, skill, 'player', {
      destination: enemy1.position,
    });
    expect(affected.length).toBeGreaterThanOrEqual(1);

    const result = dispatchAction(state, {
      type: 'skill',
      combatantId: 'player',
      skillId: 'skill_meteor',
      destination: enemy1.position,
    });
    expect(result.ok).toBe(true);
  });

  it('healing rain heals multiple allies', () => {
    const { state, ally } = setupCluster();
    const skill = defaultRegistry.getSkill('skill_healing_rain')!;

    const targets = getValidTargets(state, skill, 'player');
    expect(targets).toContain('ally');
    expect(targets).toContain('player');

    const result = dispatchAction(state, {
      type: 'skill',
      combatantId: 'player',
      skillId: 'skill_healing_rain',
      targetId: ally.id,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.events.some((e) => e.type === 'heal_applied')).toBe(true);
  });

  it('getAffectedTiles returns blast zone', () => {
    const { state, enemy1 } = setupCluster();
    const skill = defaultRegistry.getSkill('skill_arcane_burst')!;
    const tiles = getAffectedTiles(state, skill, 'player', { targetId: enemy1.id });
    expect(tiles.length).toBeGreaterThan(1);
  });

  it('preview returns multi-target damage for arcane burst', () => {
    const { state, enemy1 } = setupCluster();
    const result = preview(state, 'skill_arcane_burst', 'player', { targetId: enemy1.id });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.damage.size).toBeGreaterThanOrEqual(2);
  });
});
