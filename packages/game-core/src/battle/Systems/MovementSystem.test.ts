import { describe, expect, it, vi } from 'vitest';
import { MovementSystem } from './MovementSystem';
import { createBattleState } from '../BattleState';
import { createTestClock, createSeededRandom } from '@dawn/utils';
import { defaultRegistry } from '@dawn/game-data';
import { BattleLog } from '../BattleLog';
import { EventBus } from '../../events/EventBus';
import type { BattleEvent } from '@dawn/types';

describe('MovementSystem', () => {
  it('moves entity and emits event', () => {
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
            attack: 20,
            defense: 10,
            speed: 50,
            critRate: 0.1,
            critDamage: 1.5,
          },
          skillIds: [],
        },
      ],
      enemyUnits: [],
    });

    const actorId = state.turn.currentEntityId!;
    const eventBus = new EventBus<BattleEvent>();
    const handler = vi.fn();
    eventBus.subscribe('player_moved', handler);

    const system = new MovementSystem();
    system.execute(
      state,
      { type: 'move', actorId, targetPosition: { q: 1, r: 0 } },
      {
        engine: {
          clock: createTestClock(),
          random: createSeededRandom(1),
          definitions: defaultRegistry,
        },
        eventBus,
        battleLog: new BattleLog(createTestClock()),
      },
    );

    expect(state.entities[actorId]?.position).toEqual({ q: 1, r: 0 });
    expect(handler).toHaveBeenCalled();
  });
});
