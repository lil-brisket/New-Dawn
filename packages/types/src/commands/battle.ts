import type { HexCoord } from '../battle/grid';

export interface MoveCommand {
  type: 'move';
  actorId: string;
  targetPosition: HexCoord;
}

export interface AttackCommand {
  type: 'attack';
  actorId: string;
  targetId: string;
}

export interface SkillCommand {
  type: 'skill';
  actorId: string;
  skillId: string;
  targetIds: string[];
  targetPosition?: HexCoord;
}

export interface EndTurnCommand {
  type: 'end_turn';
  actorId: string;
}

export interface ItemCommand {
  type: 'item';
  actorId: string;
  itemId: string;
  targetId?: string;
}

export type BattleCommand =
  MoveCommand | AttackCommand | SkillCommand | EndTurnCommand | ItemCommand;

export interface CommandResult {
  success: boolean;
  error?: string;
  command: BattleCommand;
}
