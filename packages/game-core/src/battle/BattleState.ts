import type { BattleState, BattleUnit } from '@dawn/types';
import { createId } from '@dawn/utils';
import { HexGrid } from '../grid/HexGrid';
import { GRID_CONSTANTS } from '../constants/GridConstants';

export interface CreateBattleOptions {
  id?: string;
  playerUnits: Array<
    Omit<BattleUnit, 'id' | 'turnOrder' | 'cooldowns' | 'statusEffectIds' | 'isAlive'>
  >;
  enemyUnits: Array<
    Omit<BattleUnit, 'id' | 'turnOrder' | 'cooldowns' | 'statusEffectIds' | 'isAlive'>
  >;
}

export function createBattleState(options: CreateBattleOptions): BattleState {
  const entities: Record<string, BattleUnit> = {};
  const allUnits = [
    ...options.playerUnits.map((u, i) => ({ ...u, faction: 'player' as const, order: i })),
    ...options.enemyUnits.map((u, i) => ({ ...u, faction: 'enemy' as const, order: i + 100 })),
  ];

  const initiativeOrder: string[] = [];

  for (const unit of allUnits) {
    const id = createId('unit');
    entities[id] = {
      ...unit,
      id,
      turnOrder: unit.order,
      cooldowns: {},
      statusEffectIds: [],
      isAlive: true,
    };
    initiativeOrder.push(id);
  }

  initiativeOrder.sort((a, b) => (entities[b]?.stats.speed ?? 0) - (entities[a]?.stats.speed ?? 0));

  const grid = new HexGrid(GRID_CONSTANTS.SIZE, GRID_CONSTANTS.SIZE);

  return {
    id: options.id ?? createId('battle'),
    phase: 'player_turn',
    outcome: 'ongoing',
    gridWidth: GRID_CONSTANTS.SIZE,
    gridHeight: GRID_CONSTANTS.SIZE,
    entities,
    turn: {
      currentEntityId: initiativeOrder[0] ?? null,
      round: 1,
      turnIndex: 0,
      initiativeOrder,
    },
    cells: grid.getAllCells(),
  };
}
