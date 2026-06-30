import type { HexCoord } from '../battle/grid';
import type { Team } from '../battle/team';

export interface CombatantMovedEvent {
  readonly type: 'combatant_moved';
  readonly combatantId: string;
  readonly from: HexCoord;
  readonly to: HexCoord;
}

export interface DamageDealtEvent {
  readonly type: 'damage_dealt';
  readonly sourceId: string;
  readonly targetId: string;
  readonly amount: number;
}

export interface CombatantKilledEvent {
  readonly type: 'combatant_killed';
  readonly combatantId: string;
  readonly killerId: string;
}

export interface TurnStartedEvent {
  readonly type: 'turn_started';
  readonly combatantId: string;
  readonly round: number;
}

export interface TurnEndedEvent {
  readonly type: 'turn_ended';
  readonly combatantId: string;
}

export interface BattleWonEvent {
  readonly type: 'battle_won';
  readonly team: Team;
}

export type BattleEvent =
  | CombatantMovedEvent
  | DamageDealtEvent
  | CombatantKilledEvent
  | TurnStartedEvent
  | TurnEndedEvent
  | BattleWonEvent;

export type BattleEventType = BattleEvent['type'];
