import { createBattle, createGrid, dispatchAction } from '@dawn/game-core';
import type { ActionResult, BattleAction, BattleEvent, BattleState, Combatant } from '@dawn/types';
import { defaultRegistry } from '@dawn/game-data';
import { createId } from '@dawn/utils';
import { enemyLine, playerLine } from '@/features/battle/sandbox/spawns';
import type { BattleRepository, StartBattleRequest } from './types';

const battles = new Map<string, BattleState>();

function combatantFromDefinition(
  id: string,
  team: 'player' | 'enemy',
  position: Combatant['position'],
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
    position,
    hp: stats.hp,
    maxHp: stats.maxHp,
    sp: stats.mp,
    maxSp: stats.maxMp,
    attack: stats.attack,
    defense: stats.defense,
    movement: 3,
    ap: 30,
    maxAp: 30,
    powerStat: stats.attack,
    skillIds: def?.skillIds ?? [],
    statuses: [],
    skillCooldowns: {},
  };
}

function createStateFromRequest(request: StartBattleRequest): BattleState {
  const playerIds = request.playerCharacterIds.length > 0 ? request.playerCharacterIds : ['hero'];
  const enemyIds = request.enemyDefinitionIds;

  const grid = createGrid({ width: 8, height: 8 });
  const playerSpawns = playerLine(playerIds.length, 1, 3);
  const enemySpawns = enemyLine(enemyIds.length, 6, 3);

  const party = playerIds.map((id, index) =>
    combatantFromDefinition(id, 'player', playerSpawns[index]!),
  );
  const enemies = enemyIds.map((id, index) =>
    combatantFromDefinition(id, 'enemy', enemySpawns[index]!),
  );

  const result = createBattle({
    party,
    enemies,
    grid,
    seed: 42,
  });
  if (!result.ok) {
    throw new Error(`Failed to create battle: ${result.error.code}`);
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
