import type { HexCoord } from '../battle/grid';
import type { BattleState } from '../battle/state';
import type { BattleEvent } from '../events/battle';

export interface MoveAction {
  readonly type: 'move';
  readonly combatantId: string;
  readonly destination: HexCoord;
}

export interface AttackAction {
  readonly type: 'attack';
  readonly combatantId: string;
  readonly targetId: string;
}

export interface EndTurnAction {
  readonly type: 'end_turn';
  readonly combatantId: string;
}

export interface SkillAction {
  readonly type: 'skill';
  readonly combatantId: string;
  readonly skillId: string;
  readonly targetId?: string;
  readonly destination?: HexCoord;
}

export type BattleAction = MoveAction | AttackAction | EndTurnAction | SkillAction;

export type BattleError =
  | { readonly code: 'OutOfRange' }
  | { readonly code: 'TileOccupied' }
  | { readonly code: 'DeadCombatant' }
  | { readonly code: 'WrongTurn' }
  | { readonly code: 'InsufficientAp' }
  | { readonly code: 'AlreadyAttacked' }
  | { readonly code: 'NotAdjacent' }
  | { readonly code: 'CannotAttackAlly' }
  | { readonly code: 'TargetNotFound' }
  | { readonly code: 'CombatantNotFound' }
  | { readonly code: 'NotWalkable' }
  | { readonly code: 'BattleOver' }
  | { readonly code: 'MaxMovesReached' }
  | { readonly code: 'InvalidBattleSetup' }
  | { readonly code: 'UnknownAction' }
  | { readonly code: 'InsufficientSp' }
  | { readonly code: 'SkillOnCooldown' }
  | { readonly code: 'InvalidSkillTarget' }
  | { readonly code: 'SkillNotFound' }
  | { readonly code: 'Stunned' }
  | { readonly code: 'PrimaryActionUsed' };

export type ActionResult =
  | { readonly ok: true; readonly state: BattleState; readonly events: readonly BattleEvent[] }
  | { readonly ok: false; readonly error: BattleError };

/** @deprecated Use BattleAction */
export interface MoveCommand {
  type: 'move';
  actorId: string;
  targetPosition: HexCoord;
}

/** @deprecated Use BattleAction */
export interface AttackCommand {
  type: 'attack';
  actorId: string;
  targetId: string;
}

/** @deprecated Use BattleAction */
export interface EndTurnCommand {
  type: 'end_turn';
  actorId: string;
}

/** @deprecated Use BattleAction */
export type BattleCommand = MoveCommand | AttackCommand | EndTurnCommand;
