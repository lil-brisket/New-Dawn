import { describe, expect, it } from 'vitest';
import type { Combatant } from '@dawn/types';
import { createHex } from '../../grid/HexCoord';
import { createGrid, offsetToCube } from '../../grid/Grid';
import { createCombatant } from '../../entities/Combatant';
import { createBattle } from '../../battle/createBattle';
import { dispatchAction } from '../../battle/dispatchAction';
import { applyTag } from '../../systems/tag/applyTag';
import { defaultRegistry } from '@dawn/game-data';
import { createSeededRandom } from '@dawn/utils';
import { nearestEnemyStrategy } from './nearestEnemy';

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

describe('nearestEnemyStrategy', () => {
  const grid = createGrid({ width: 8, height: 8 });

  it('plans attack when adjacent to player', () => {
    const player = makeCombatant({ id: 'player', team: 'player', position: createHex(0, 0) });
    const enemy = makeCombatant({ id: 'e1', team: 'enemy', position: createHex(1, -1) });
    const battle = createBattle({ player, enemies: [enemy], grid });
    if (!battle.ok) return;

    const afterPlayer = dispatchAction(battle.state, {
      type: 'end_turn',
      combatantId: 'player',
    });
    if (!afterPlayer.ok) return;

    const actions = nearestEnemyStrategy.planTurn(afterPlayer.state);
    expect(actions.some((a) => a.type === 'attack' && a.targetId === 'player')).toBe(true);
    expect(actions[actions.length - 1]?.type).toBe('end_turn');
  });

  it('plans move toward closest player when not adjacent', () => {
    const player = makeCombatant({ id: 'player', team: 'player', position: createHex(0, 0) });
    const enemy = makeCombatant({
      id: 'e1',
      team: 'enemy',
      position: createHex(4, -4),
    });
    const battle = createBattle({ player, enemies: [enemy], grid });
    if (!battle.ok) return;

    const afterPlayer = dispatchAction(battle.state, {
      type: 'end_turn',
      combatantId: 'player',
    });
    if (!afterPlayer.ok) return;

    const actions = nearestEnemyStrategy.planTurn(afterPlayer.state);
    expect(actions[0]?.type).toBe('move');
    expect(actions[actions.length - 1]?.type).toBe('end_turn');
  });

  it('plans end_turn for each enemy in a 2v2 duel round', () => {
    const grid = createGrid({ width: 10, height: 8 });
    const p1 = makeCombatant({ id: 'knight-1', team: 'player', position: offsetToCube(1, 3) });
    const p2 = makeCombatant({ id: 'knight-2', team: 'player', position: offsetToCube(2, 3) });
    const g1 = makeCombatant({ id: 'goblin-1', team: 'enemy', position: offsetToCube(7, 3) });
    const g2 = makeCombatant({ id: 'goblin-2', team: 'enemy', position: offsetToCube(8, 3) });
    const battle = createBattle({ party: [p1, p2], enemies: [g1, g2], grid });
    if (!battle.ok) return;

    let state = battle.state;
    for (const id of ['knight-1', 'knight-2'] as const) {
      const end = dispatchAction(state, { type: 'end_turn', combatantId: id });
      if (!end.ok) return;
      state = end.state;
    }

    expect(state.activeCombatantId).toBe('goblin-1');

    const g1Actions = nearestEnemyStrategy.planTurn(state);
    expect(g1Actions[g1Actions.length - 1]?.type).toBe('end_turn');

    for (const action of g1Actions) {
      const result = dispatchAction(state, action);
      if (!result.ok) return;
      state = result.state;
    }

    expect(state.activeCombatantId).toBe('goblin-2');

    const g2Actions = nearestEnemyStrategy.planTurn(state);
    expect(g2Actions[g2Actions.length - 1]?.type).toBe('end_turn');

    for (const action of g2Actions) {
      const result = dispatchAction(state, action);
      if (!result.ok) return;
      state = result.state;
    }

    expect(state.activeCombatantId).toBe('knight-1');
    expect(state.round).toBe(2);
  });

  it('skips turn when stunned', () => {
    const player = makeCombatant({ id: 'player', team: 'player', position: createHex(0, 0) });
    const enemy = makeCombatant({ id: 'e1', team: 'enemy', position: createHex(1, -1) });
    const battle = createBattle({ player, enemies: [enemy], grid });
    if (!battle.ok) return;

    let state = battle.state;
    const stunned = applyTag({
      state,
      sourceId: 'player',
      targetId: 'e1',
      tagId: 'tag_stun',
      chance: 1,
      registry: defaultRegistry,
      rng: createSeededRandom(1),
    });
    state = stunned.state;

    const afterPlayer = dispatchAction(state, { type: 'end_turn', combatantId: 'player' });
    if (!afterPlayer.ok) return;

    const actions = nearestEnemyStrategy.planTurn(afterPlayer.state);
    expect(actions).toEqual([{ type: 'end_turn', combatantId: 'e1' }]);

    const endEnemy = dispatchAction(afterPlayer.state, actions[0]!);
    expect(endEnemy.ok).toBe(true);
    if (!endEnemy.ok) return;
    expect(endEnemy.state.activeCombatantId).toBe('player');
  });
});
