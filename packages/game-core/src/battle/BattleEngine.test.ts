import { describe, expect, it } from 'vitest';
import { defaultRegistry } from '@dawn/game-data';
import { createTestClock, createSeededRandom } from '@dawn/utils';
import { BattleEngine } from './BattleEngine';
import { createBattleState } from './BattleState';

describe('BattleEngine', () => {
  it('submits attack command and reduces target hp', () => {
    const state = createBattleState({
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
            attack: 50,
            defense: 10,
            speed: 80,
            critRate: 0,
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
            hp: 100,
            maxHp: 100,
            mp: 10,
            maxMp: 10,
            attack: 10,
            defense: 5,
            speed: 30,
            critRate: 0,
            critDamage: 1.2,
          },
          skillIds: [],
        },
      ],
    });

    const engine = new BattleEngine(state, {
      clock: createTestClock(),
      random: createSeededRandom(42),
      definitions: defaultRegistry,
    });

    const actorId = state.turn.currentEntityId!;
    const targetId = Object.values(state.entities).find((e) => e.faction === 'enemy')!.id;

    const result = engine.submitCommand({ type: 'attack', actorId, targetId });
    expect(result.success).toBe(true);

    const snapshot = engine.getSnapshot();
    const target = snapshot.entities[targetId];
    expect(target?.stats.hp).toBeLessThan(100);
  });
});
