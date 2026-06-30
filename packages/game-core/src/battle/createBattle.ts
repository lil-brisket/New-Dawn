import type {
  BattleConfig,
  BattleError,
  BattleEvent,
  BattleState,
  Combatant,
  Grid,
} from '@dawn/types';
import type { Result } from '@dawn/utils';
import { err, ok } from '@dawn/utils';
import { createId } from '@dawn/utils';
import { createGrid } from '../grid/Grid';
import { DEFAULT_BATTLE_CONFIG } from '../rules/defaultRules';
import { startTurn } from '../systems/turn/apply';
import { createTurnOrder, findNextLivingCombatant } from '../systems/turn/validate';

export interface CreateBattleInput {
  readonly player: Combatant;
  readonly enemies: readonly Combatant[];
  readonly grid?: Grid;
  readonly gridSize?: { readonly width: number; readonly height: number };
  readonly config?: BattleConfig;
  readonly seed?: number;
  readonly createdAt?: number;
  readonly battleId?: string;
}

export type CreateBattleResult =
  | { readonly ok: true; readonly state: BattleState; readonly events: readonly BattleEvent[] }
  | { readonly ok: false; readonly error: BattleError };

function validateBattleSetup(
  player: Combatant,
  enemies: readonly Combatant[],
): Result<void, BattleError> {
  if (player.team !== 'player') {
    return err({ code: 'InvalidBattleSetup' });
  }

  if (enemies.length === 0) {
    return err({ code: 'InvalidBattleSetup' });
  }

  const ids = new Set<string>([player.id]);
  for (const enemy of enemies) {
    if (enemy.team !== 'enemy') {
      return err({ code: 'InvalidBattleSetup' });
    }
    if (ids.has(enemy.id)) {
      return err({ code: 'InvalidBattleSetup' });
    }
    ids.add(enemy.id);
  }

  return ok(undefined);
}

export function createBattle(input: CreateBattleInput): CreateBattleResult {
  const validation = validateBattleSetup(input.player, input.enemies);
  if (!validation.ok) {
    return { ok: false, error: validation.error };
  }

  const config = input.config ?? DEFAULT_BATTLE_CONFIG;
  const battleId = input.battleId ?? createId('battle');
  const seed = input.seed ?? 0;
  const createdAt = input.createdAt ?? 0;
  const grid = input.grid ?? createGrid(input.gridSize ?? { width: 8, height: 8 });

  const combatantMap = new Map<string, Combatant>();
  combatantMap.set(input.player.id, input.player);
  for (const enemy of input.enemies) {
    combatantMap.set(enemy.id, enemy);
  }

  const turnOrder = createTurnOrder(input.player, input.enemies);
  const first = findNextLivingCombatant(
    {
      battleId,
      round: 1,
      turn: 0,
      seed,
      createdAt,
      playerId: input.player.id,
      activeCombatantId: null,
      combatants: combatantMap,
      grid,
      config,
      turnOrder,
      turnActionState: { movesUsed: 0, hasAttacked: false, apSpent: 0 },
      winner: null,
      history: [],
    },
    0,
  );

  let state: BattleState = {
    battleId,
    round: 1,
    turn: first?.turnIndex ?? 0,
    seed,
    createdAt,
    playerId: input.player.id,
    activeCombatantId: first?.combatantId ?? null,
    combatants: combatantMap,
    grid,
    config,
    turnOrder,
    turnActionState: { movesUsed: 0, hasAttacked: false, apSpent: 0 },
    winner: null,
    history: [],
  };

  const events: BattleEvent[] = [];

  if (first) {
    state = startTurn(state, first.combatantId);
    events.push({ type: 'turn_started', combatantId: first.combatantId, round: 1 });
  }

  return { ok: true, state, events };
}
