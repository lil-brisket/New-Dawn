import { describe, expect, it } from 'vitest';
import { createHex } from '../../grid/HexCoord';
import { createGrid } from '../../grid/Grid';
import { createCombatant } from '../../entities/Combatant';
import { createBattle } from '../../battle/createBattle';
import { dispatchAction } from '../../battle/dispatchAction';
import { defaultRegistry } from '@dawn/game-data';
import { applyTag } from './applyTag';
import { tickTags, decayTags } from './tickTags';
import { getEffectiveStats } from './getEffectiveStats';
import { createSeededRandom } from '@dawn/utils';

function setup() {
  const grid = createGrid({ width: 6, height: 6 });
  const player = createCombatant({
    id: 'player',
    name: 'Knight',
    team: 'player',
    position: createHex(0, 0),
    hp: 100,
    maxHp: 100,
    sp: 50,
    maxSp: 50,
    attack: 20,
    defense: 5,
    movement: 3,
    ap: 30,
    maxAp: 30,
    skillIds: ['skill_slash'],
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
  const battle = createBattle({ player, enemies: [enemy], grid, seed: 1 });
  expect(battle.ok).toBe(true);
  return battle.ok ? battle.state : null!;
}

describe('tag system', () => {
  it('ticks burn damage at turn start', () => {
    let state = setup();
    const rng = createSeededRandom(1);
    const applied = applyTag({
      state,
      sourceId: 'player',
      targetId: 'enemy',
      tagId: 'tag_burn',
      chance: 1,
      registry: defaultRegistry,
      rng,
    });
    state = applied.state;
    const tick = tickTags(state, 'enemy', defaultRegistry);
    expect(tick.events.some((e) => e.type === 'tag_tick')).toBe(true);
    expect(tick.events.some((e) => e.type === 'damage_dealt')).toBe(true);
    expect(tick.state.combatants.get('enemy')!.hp).toBeLessThan(100);
  });

  it('decays tag at end of turn', () => {
    let state = setup();
    const rng = createSeededRandom(1);
    const applied = applyTag({
      state,
      sourceId: 'player',
      targetId: 'enemy',
      tagId: 'tag_stun',
      chance: 1,
      registry: defaultRegistry,
      rng,
    });
    state = applied.state;
    const decay = decayTags(state, 'enemy', defaultRegistry);
    expect(decay.state.combatants.get('enemy')!.tags).toHaveLength(0);
    expect(decay.events.some((e) => e.type === 'tag_removed')).toBe(true);
  });

  it('stun blocks attack', () => {
    let state = setup();
    const rng = createSeededRandom(1);
    state = applyTag({
      state,
      sourceId: 'player',
      targetId: 'player',
      tagId: 'tag_stun',
      chance: 1,
      registry: defaultRegistry,
      rng,
    }).state;

    const result = dispatchAction(state, {
      type: 'attack',
      combatantId: 'player',
      targetId: 'enemy',
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe('Stunned');
  });

  it('attack up increases effective attack', () => {
    let state = setup();
    const rng = createSeededRandom(1);
    state = applyTag({
      state,
      sourceId: 'player',
      targetId: 'player',
      tagId: 'tag_attack_up',
      chance: 1,
      registry: defaultRegistry,
      rng,
    }).state;

    const combatant = state.combatants.get('player')!;
    const stats = getEffectiveStats(combatant, defaultRegistry);
    expect(stats.attack).toBeGreaterThan(combatant.attack);
  });
});
