import { BattleEngine, createBattleState } from '@dawn/game-core';
import type { BattleCommand } from '@dawn/types';
import { defaultRegistry } from '@dawn/game-data';
import { createTestClock, createSeededRandom } from '@dawn/utils';
import type { BattleRepository, StartBattleRequest } from './types';

const engines = new Map<string, BattleEngine>();

function createEngineFromRequest(request: StartBattleRequest): BattleEngine {
  const state = createBattleState({
    playerUnits: request.playerCharacterIds.map((id, i) => ({
      definitionId: id,
      name: defaultRegistry.getCharacter(id)?.name ?? 'Hero',
      faction: 'player' as const,
      position: { q: 0, r: i },
      stats: defaultRegistry.getCharacter(id)?.baseStats ?? {
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
      skillIds: defaultRegistry.getCharacter(id)?.skillIds ?? [],
    })),
    enemyUnits: request.enemyDefinitionIds.map((id, i) => ({
      definitionId: id,
      name: defaultRegistry.getEnemy(id)?.name ?? 'Enemy',
      faction: 'enemy' as const,
      position: { q: 5, r: i },
      stats: defaultRegistry.getEnemy(id)?.baseStats ?? {
        hp: 80,
        maxHp: 80,
        mp: 20,
        maxMp: 20,
        attack: 15,
        defense: 8,
        speed: 30,
        critRate: 0.05,
        critDamage: 1.2,
      },
      skillIds: defaultRegistry.getEnemy(id)?.skillIds ?? [],
    })),
  });

  return new BattleEngine(state, {
    clock: createTestClock(),
    random: createSeededRandom(42),
    definitions: defaultRegistry,
  });
}

export class MockBattleRepository implements BattleRepository {
  async startBattle(request: StartBattleRequest) {
    const engine = createEngineFromRequest(request);
    engines.set(engine.getState().id, engine);
    return {
      snapshot: engine.getSnapshot(),
      log: [...engine.getBattleLog()],
    };
  }

  async submitCommand(battleId: string, command: BattleCommand) {
    const engine = engines.get(battleId);
    if (!engine) {
      return { success: false, error: 'Battle not found', command };
    }
    const result = engine.submitCommand(command);
    return { ...result, snapshot: engine.getSnapshot() };
  }
}

export const battleRepository: BattleRepository = new MockBattleRepository();
