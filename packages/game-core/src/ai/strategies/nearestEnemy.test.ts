import { describe, expect, it } from 'vitest';
import type { Combatant } from '@dawn/types';
import { createHex } from '../../grid/HexCoord';
import { createGrid } from '../../grid/Grid';
import { createCombatant } from '../../entities/Combatant';
import { createBattle } from '../../battle/createBattle';
import { dispatchAction } from '../../battle/dispatchAction';
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
});
