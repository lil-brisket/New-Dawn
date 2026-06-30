import type { BattleCommandState, BattleActionType } from './BattleCommandState';
import type { BattleMode } from '../hooks/useBattle';

export function modeToCommandState(mode: BattleMode): BattleCommandState {
  switch (mode) {
    case 'move':
      return 'selecting_move';
    case 'attack':
      return 'selecting_attack';
    default:
      return 'idle';
  }
}

export function commandStateToMode(state: BattleCommandState): BattleMode {
  switch (state) {
    case 'selecting_move':
      return 'move';
    case 'selecting_attack':
      return 'attack';
    default:
      return 'idle';
  }
}

export interface CommandContext {
  commandState: BattleCommandState;
  canAct: boolean;
  playerTurn: boolean;
  battleEnded: boolean;
}

export function isActionEnabled(ctx: CommandContext, action: BattleActionType): boolean {
  const { commandState, canAct, playerTurn, battleEnded } = ctx;

  if (battleEnded) {
    return action === 'end_turn' ? false : false;
  }

  if (commandState === 'animation_locked' || commandState === 'enemy_turn') {
    return false;
  }

  switch (action) {
    case 'attack':
    case 'move':
      return canAct && commandState !== 'victory' && commandState !== 'defeat';
    case 'end_turn':
      return playerTurn && commandState !== 'victory' && commandState !== 'defeat';
    case 'item':
    case 'skill':
      return false;
    default:
      return false;
  }
}

export function isActionSelected(
  commandState: BattleCommandState,
  action: BattleActionType,
): boolean {
  switch (action) {
    case 'move':
      return commandState === 'selecting_move' || commandState === 'waiting_for_target';
    case 'attack':
      return commandState === 'selecting_attack';
    case 'skill':
      return commandState === 'selecting_skill';
    default:
      return false;
  }
}

export function deriveCommandState(params: {
  mode: BattleMode;
  playerTurn: boolean;
  winner: 'player' | 'enemy' | null;
  animationLocked: boolean;
}): BattleCommandState {
  const { mode, playerTurn, winner, animationLocked } = params;

  if (animationLocked) return 'animation_locked';
  if (winner === 'player') return 'victory';
  if (winner === 'enemy') return 'defeat';
  if (!playerTurn) return 'enemy_turn';

  const base = modeToCommandState(mode);
  if (base === 'selecting_move' || base === 'selecting_attack') {
    return base;
  }
  return 'idle';
}
