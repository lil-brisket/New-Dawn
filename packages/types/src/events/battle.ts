import type { HexCoord } from '../battle/grid';

export interface PlayerMovedEvent {
  type: 'player_moved';
  entityId: string;
  from: HexCoord;
  to: HexCoord;
  animationKey?: string;
  soundKey?: string;
}

export interface DamageTakenEvent {
  type: 'damage_taken';
  sourceId: string;
  targetId: string;
  amount: number;
  isCritical: boolean;
  animationKey?: string;
  soundKey?: string;
}

export interface EnemyDiedEvent {
  type: 'enemy_died';
  entityId: string;
  killerId?: string;
  animationKey?: string;
  soundKey?: string;
}

export interface SkillUsedEvent {
  type: 'skill_used';
  actorId: string;
  skillId: string;
  targetIds: string[];
  animationKey?: string;
  soundKey?: string;
}

export interface BuffAppliedEvent {
  type: 'buff_applied';
  sourceId: string;
  targetId: string;
  statusId: string;
  animationKey?: string;
  soundKey?: string;
}

export interface TurnStartedEvent {
  type: 'turn_started';
  entityId: string;
  round: number;
}

export interface TurnEndedEvent {
  type: 'turn_ended';
  entityId: string;
}

export interface BattleVictoryEvent {
  type: 'battle_victory';
}

export interface BattleDefeatEvent {
  type: 'battle_defeat';
}

export type BattleEvent =
  | PlayerMovedEvent
  | DamageTakenEvent
  | EnemyDiedEvent
  | SkillUsedEvent
  | BuffAppliedEvent
  | TurnStartedEvent
  | TurnEndedEvent
  | BattleVictoryEvent
  | BattleDefeatEvent;

export type BattleEventType = BattleEvent['type'];
