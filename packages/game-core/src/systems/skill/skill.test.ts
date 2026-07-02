import { describe, expect, it } from 'vitest';
import type { Combatant } from '@dawn/types';
import { createHex } from '../../grid/HexCoord';
import { createGrid } from '../../grid/Grid';
import { createCombatant } from '../../entities/Combatant';
import { createBattle } from '../../battle/createBattle';
import { dispatchAction } from '../../battle/dispatchAction';
import { simulateSkill } from './simulateSkill';
import { applyTag } from '../tag/applyTag';
import { defaultRegistry } from '@dawn/game-data';
import { createSeededRandom } from '@dawn/utils';

const ALL_SKILLS = [
  'skill_slash',
  'skill_fireball',
  'skill_mend',
  'skill_second_wind',
  'skill_war_cry',
  'skill_poison_dart',
  'skill_blink',
] as const;

function makeKnight(overrides?: Partial<Combatant>): Combatant {
  return createCombatant({
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
    skillIds: [...ALL_SKILLS],
    ...overrides,
  });
}

function setup() {
  const grid = createGrid({ width: 8, height: 8 });
  const player = makeKnight();
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
  const battle = createBattle({
    party: [player, ally],
    enemies: [enemy],
    grid,
    seed: 42,
  });
  expect(battle.ok).toBe(true);
  return { battle: battle.ok ? battle.state : null!, enemy, ally };
}

describe('skill system', () => {
  it('casts slash and deals damage', () => {
    const { battle, enemy } = setup();
    const result = dispatchAction(battle, {
      type: 'skill',
      combatantId: 'player',
      skillId: 'skill_slash',
      targetId: enemy.id,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.events.some((e) => e.type === 'skill_used')).toBe(true);
    expect(result.events.some((e) => e.type === 'damage_dealt')).toBe(true);
    expect(result.state.turnActionState.hasUsedPrimaryAction).toBe(true);
    const target = result.state.combatants.get(enemy.id);
    expect(target!.hp).toBeLessThan(100);
  });

  it('deducts SP on cast', () => {
    const { battle, enemy } = setup();
    const result = dispatchAction(battle, {
      type: 'skill',
      combatantId: 'player',
      skillId: 'skill_fireball',
      targetId: enemy.id,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.combatants.get('player')!.sp).toBe(75);
  });

  it('puts skill on cooldown when cooldown > 0', () => {
    const { battle, enemy } = setup();
    const result = dispatchAction(battle, {
      type: 'skill',
      combatantId: 'player',
      skillId: 'skill_fireball',
      targetId: enemy.id,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.combatants.get('player')!.skillCooldowns['skill_fireball']).toBe(2);
  });

  it('blocks skill when primary action used', () => {
    const { battle, enemy } = setup();
    const attack = dispatchAction(battle, {
      type: 'attack',
      combatantId: 'player',
      targetId: enemy.id,
    });
    expect(attack.ok).toBe(true);
    if (!attack.ok) return;
    const skill = dispatchAction(attack.state, {
      type: 'skill',
      combatantId: 'player',
      skillId: 'skill_slash',
      targetId: enemy.id,
    });
    expect(skill.ok).toBe(false);
    if (skill.ok) return;
    expect(skill.error.code).toBe('PrimaryActionUsed');
  });

  it('heals ally with mend', () => {
    const { battle, ally } = setup();
    const result = dispatchAction(battle, {
      type: 'skill',
      combatantId: 'player',
      skillId: 'skill_mend',
      targetId: ally.id,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.events.some((e) => e.type === 'heal_applied')).toBe(true);
    expect(result.state.combatants.get(ally.id)!.hp).toBeGreaterThan(50);
  });

  it('self heal with second wind', () => {
    let { battle } = setup();
    const player = battle.combatants.get('player')!;
    battle = {
      ...battle,
      combatants: new Map(battle.combatants).set('player', createCombatant({ ...player, hp: 40 })),
    };
    const result = dispatchAction(battle, {
      type: 'skill',
      combatantId: 'player',
      skillId: 'skill_second_wind',
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.combatants.get('player')!.hp).toBeGreaterThan(40);
  });

  it('blink teleports to destination', () => {
    const { battle } = setup();
    const dest = createHex(2, -2);
    const result = dispatchAction(battle, {
      type: 'skill',
      combatantId: 'player',
      skillId: 'skill_blink',
      destination: dest,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.combatants.get('player')!.position).toEqual(dest);
    expect(result.events.some((e) => e.type === 'combatant_moved')).toBe(true);
  });

  it('simulateSkill does not mutate state', () => {
    const { battle, enemy } = setup();
    const hpBefore = battle.combatants.get(enemy.id)!.hp;
    const sim = simulateSkill(battle, {
      type: 'skill',
      combatantId: 'player',
      skillId: 'skill_slash',
      targetId: enemy.id,
    });
    expect(sim.ok).toBe(true);
    if (!('damage' in sim) || !sim.ok) return;
    expect(battle.combatants.get(enemy.id)!.hp).toBe(hpBefore);
    expect(sim.damage.get(enemy.id)).toBeGreaterThan(0);
  });
});

describe('tag on skill', () => {
  it('applies burn from fireball with seeded rng', () => {
    const { battle, enemy } = setup();
    const rng = createSeededRandom(999);
    let state = battle;
    const applied = applyTag({
      state,
      sourceId: 'player',
      targetId: enemy.id,
      tagId: 'tag_burn',
      chance: 1,
      registry: defaultRegistry,
      rng,
    });
    state = applied.state;
    expect(applied.applied).toBe(true);
    expect(state.combatants.get(enemy.id)!.tags.length).toBe(1);
  });
});
