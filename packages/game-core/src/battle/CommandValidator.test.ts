import { describe, expect, it } from 'vitest';
import { createBattleState } from './BattleState';
import { validateCommand } from './CommandValidator';

function makeState() {
  return createBattleState({
    playerUnits: [
      {
        definitionId: 'char_astra',
        name: 'Astra',
        faction: 'player',
        position: { q: 0, r: 0 },
        stats: {
          hp: 100,
          maxHp: 100,
          mp: 50,
          maxMp: 50,
          attack: 20,
          defense: 10,
          speed: 50,
          critRate: 0.1,
          critDamage: 1.5,
        },
        skillIds: [],
      },
    ],
    enemyUnits: [
      {
        definitionId: 'enemy_goblin',
        name: 'Goblin',
        faction: 'enemy',
        position: { q: 1, r: 0 },
        stats: {
          hp: 50,
          maxHp: 50,
          mp: 10,
          maxMp: 10,
          attack: 10,
          defense: 5,
          speed: 30,
          critRate: 0.05,
          critDamage: 1.2,
        },
        skillIds: [],
      },
    ],
  });
}

describe('CommandValidator', () => {
  it('rejects move out of range', () => {
    const state = makeState();
    const actorId = state.turn.currentEntityId!;
    const result = validateCommand(state, {
      type: 'move',
      actorId,
      targetPosition: { q: 5, r: 5 },
    });
    expect(result.ok).toBe(false);
  });

  it('accepts valid attack', () => {
    const state = makeState();
    const actorId = state.turn.currentEntityId!;
    const targetId = Object.values(state.entities).find((e) => e.faction === 'enemy')!.id;
    const result = validateCommand(state, { type: 'attack', actorId, targetId });
    expect(result.ok).toBe(true);
  });
});
