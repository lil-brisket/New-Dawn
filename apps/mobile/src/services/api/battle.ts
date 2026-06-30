import { createBattle, dispatchAction } from '@dawn/game-core';
import type { ActionResult, BattleAction, BattleEvent, BattleState, Combatant } from '@dawn/types';
import { defaultRegistry } from '@dawn/game-data';
import { createHex, createId } from '@dawn/utils';
import type { BattleRepository, StartBattleRequest } from './types';

const battles = new Map<string, BattleState>();

function combatantFromDefinition(
  id: string,
  team: 'player' | 'enemy',
  col: number,
  row: number,
): Combatant {
  const def = team === 'player' ? defaultRegistry.getCharacter(id) : defaultRegistry.getEnemy(id);
  const stats = def?.baseStats ?? {
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    attack: 20,
    defense: 10,
    speed: 50,
    critRate: 0.1,
    critDamage: 1.5,
  };

  return {
    id: createId('combatant'),
    name: def?.name ?? (team === 'player' ? 'Hero' : 'Enemy'),
    team,
    position: createHex(col, row),
    hp: stats.hp,
    maxHp: stats.maxHp,
    sp: stats.mp,
    maxSp: stats.maxMp,
    attack: stats.attack,
    defense: stats.defense,
    movement: 3,
    ap: 30,
    maxAp: 30,
  };
}

function createStateFromRequest(request: StartBattleRequest): BattleState {
  const player = combatantFromDefinition(request.playerCharacterIds[0] ?? 'hero', 'player', 0, 0);
  const enemies = request.enemyDefinitionIds.map((id, i) =>
    combatantFromDefinition(id, 'enemy', 5, i),
  );
  const result = createBattle({
    player,
    enemies,
    gridSize: { width: 8, height: 8 },
    seed: 42,
  });
  if (!result.ok) {
    throw new Error('Failed to create battle');
  }
  return result.state;
}

export class MockBattleRepository implements BattleRepository {
  async startBattle(request: StartBattleRequest) {
    const state = createStateFromRequest(request);
    battles.set(state.battleId, state);
    return {
      snapshot: state,
      events: [] as BattleEvent[],
    };
  }

  async submitCommand(battleId: string, command: BattleAction): Promise<ActionResult> {
    const state = battles.get(battleId);
    if (!state) {
      return { ok: false, error: { code: 'CombatantNotFound' } };
    }
    const result = dispatchAction(state, command);
    if (result.ok) {
      battles.set(battleId, result.state);
    }
    return result;
  }
}

export const battleRepository: BattleRepository = new MockBattleRepository();
