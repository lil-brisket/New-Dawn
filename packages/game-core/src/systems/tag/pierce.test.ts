import { describe, expect, it } from 'vitest';
import { createHex } from '../../grid/HexCoord';
import { createGrid } from '../../grid/Grid';
import { createCombatant, withShield } from '../../entities/Combatant';
import { createBattle } from '../../battle/createBattle';
import { defaultRegistry } from '@dawn/game-data';
import { applyTag } from './applyTag';
import { createSeededRandom } from '@dawn/utils';

function setupCombatants(overrides?: {
  playerAttack?: number;
  enemyDefense?: number;
  enemyShieldHp?: number;
}) {
  const grid = createGrid({ width: 6, height: 6 });
  let enemy = createCombatant({
    id: 'enemy',
    name: 'Goblin',
    team: 'enemy',
    position: createHex(1, -1),
    hp: 100,
    maxHp: 100,
    sp: 20,
    maxSp: 20,
    attack: 10,
    defense: overrides?.enemyDefense ?? 10,
    movement: 3,
    ap: 30,
    maxAp: 30,
    skillIds: [],
  });
  if (overrides?.enemyShieldHp) {
    enemy = withShield(enemy, overrides.enemyShieldHp, 2);
  }
  const player = createCombatant({
    id: 'player',
    name: 'Knight',
    team: 'player',
    position: createHex(0, 0),
    hp: 100,
    maxHp: 100,
    sp: 50,
    maxSp: 50,
    attack: overrides?.playerAttack ?? 20,
    defense: 5,
    movement: 3,
    ap: 30,
    maxAp: 30,
    skillIds: [],
  });
  const battle = createBattle({ player, enemies: [enemy], grid, seed: 1 });
  expect(battle.ok).toBe(true);
  return battle.ok ? battle.state : null!;
}

function applyBuffs(
  state: ReturnType<typeof setupCombatants>,
  rng: ReturnType<typeof createSeededRandom>,
) {
  state = applyTag({
    state,
    sourceId: 'player',
    targetId: 'player',
    tagId: 'tag_attack_up',
    chance: 1,
    registry: defaultRegistry,
    rng,
  }).state;
  return applyTag({
    state,
    sourceId: 'player',
    targetId: 'enemy',
    tagId: 'tag_defense_up',
    chance: 1,
    registry: defaultRegistry,
    rng,
  }).state;
}

describe('pierce damage', () => {
  it('tag_damage respects stat mods while tag_pierce uses raw attack', () => {
    const rng = createSeededRandom(1);
    const normalState = applyBuffs(setupCombatants(), rng);
    const normalResult = applyTag({
      state: normalState,
      sourceId: 'player',
      targetId: 'enemy',
      tagId: 'tag_damage',
      chance: 1,
      registry: defaultRegistry,
      rng,
    });
    const normalDamage = normalResult.events.find((e) => e.type === 'damage_dealt');
    expect(normalDamage?.type).toBe('damage_dealt');
    if (normalDamage?.type !== 'damage_dealt') return;

    const pierceState = applyBuffs(setupCombatants(), rng);
    const pierceResult = applyTag({
      state: pierceState,
      sourceId: 'player',
      targetId: 'enemy',
      tagId: 'tag_pierce',
      chance: 1,
      registry: defaultRegistry,
      rng,
    });
    const pierceDamage = pierceResult.events.find((e) => e.type === 'damage_dealt');
    expect(pierceDamage?.type).toBe('damage_dealt');
    if (pierceDamage?.type !== 'damage_dealt') return;

    expect(pierceDamage.amount).toBe(20);
    expect(normalDamage.amount).toBeLessThan(pierceDamage.amount);
    expect(pierceDamage.pierce).toBe(true);
  });

  it('tag_pierce breaks shields and deals full damage to HP', () => {
    const rng = createSeededRandom(1);
    const state = setupCombatants({ enemyShieldHp: 50 });
    const result = applyTag({
      state,
      sourceId: 'player',
      targetId: 'enemy',
      tagId: 'tag_pierce',
      chance: 1,
      registry: defaultRegistry,
      rng,
    });

    expect(result.events.some((e) => e.type === 'shield_broken')).toBe(true);
    const damage = result.events.find((e) => e.type === 'damage_dealt');
    expect(damage?.type).toBe('damage_dealt');
    if (damage?.type !== 'damage_dealt') return;
    expect(damage.amount).toBe(20);
    expect(result.state.combatants.get('enemy')!.shieldHp).toBe(0);
    expect(result.state.combatants.get('enemy')!.hp).toBe(80);
  });

  it('tag_pierce skips reactive buff processing', () => {
    const rng = createSeededRandom(1);
    let state = setupCombatants({ playerAttack: 200, enemyDefense: 10 });
    const playerWithResistance = {
      ...state.combatants.get('enemy')!,
      resistance: 100,
    };
    state = {
      ...state,
      combatants: new Map(state.combatants).set('enemy', playerWithResistance),
    };
    state = applyTag({
      state,
      sourceId: 'player',
      targetId: 'player',
      tagId: 'tag_lifesteal',
      chance: 1,
      registry: defaultRegistry,
      rng,
    }).state;
    state = applyTag({
      state,
      sourceId: 'player',
      targetId: 'enemy',
      tagId: 'tag_absorb',
      chance: 1,
      registry: defaultRegistry,
      rng,
    }).state;

    const normalResult = applyTag({
      state,
      sourceId: 'player',
      targetId: 'enemy',
      tagId: 'tag_damage',
      chance: 1,
      registry: defaultRegistry,
      rng,
    });
    expect(normalResult.events.some((e) => e.type === 'heal_applied')).toBe(true);

    let pierceState = setupCombatants({ playerAttack: 200, enemyDefense: 10 });
    const pierceEnemyWithResistance = {
      ...pierceState.combatants.get('enemy')!,
      resistance: 100,
    };
    pierceState = {
      ...pierceState,
      combatants: new Map(pierceState.combatants).set('enemy', pierceEnemyWithResistance),
    };
    pierceState = applyTag({
      state: pierceState,
      sourceId: 'player',
      targetId: 'player',
      tagId: 'tag_lifesteal',
      chance: 1,
      registry: defaultRegistry,
      rng,
    }).state;
    pierceState = applyTag({
      state: pierceState,
      sourceId: 'player',
      targetId: 'enemy',
      tagId: 'tag_absorb',
      chance: 1,
      registry: defaultRegistry,
      rng,
    }).state;

    const pierceResult = applyTag({
      state: pierceState,
      sourceId: 'player',
      targetId: 'enemy',
      tagId: 'tag_pierce',
      chance: 1,
      registry: defaultRegistry,
      rng,
    });
    expect(pierceResult.events.some((e) => e.type === 'heal_applied')).toBe(false);
  });
});
