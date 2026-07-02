import type { ElementType } from '../common';
import type { HexCoord } from '../battle/grid';
import type { Team } from '../battle/team';

export type ActionReason = 'attack' | 'skill' | 'tag' | 'environment' | 'shield';

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
  readonly reason?: ActionReason;
  readonly skillId?: string;
  readonly element?: ElementType;
  readonly tagId?: string;
  readonly pierce?: boolean;
}

export interface HealAppliedEvent {
  readonly type: 'heal_applied';
  readonly sourceId: string;
  readonly targetId: string;
  readonly amount: number;
  readonly reason?: ActionReason;
  readonly skillId?: string;
}

export interface SkillUsedEvent {
  readonly type: 'skill_used';
  readonly sourceId: string;
  readonly skillId: string;
  readonly targetIds: readonly string[];
}

export interface TagAppliedEvent {
  readonly type: 'tag_applied';
  readonly sourceId: string;
  readonly targetId: string;
  readonly tagId: string;
  readonly stacks: number;
}

export interface TagRemovedEvent {
  readonly type: 'tag_removed';
  readonly targetId: string;
  readonly tagId: string;
}

export interface TagTickEvent {
  readonly type: 'tag_tick';
  readonly targetId: string;
  readonly tagId: string;
  readonly damage?: number;
}

export interface ShieldAppliedEvent {
  readonly type: 'shield_applied';
  readonly sourceId: string;
  readonly targetId: string;
  readonly amount: number;
  readonly turns: number;
  readonly skillId?: string;
}

export interface ShieldBrokenEvent {
  readonly type: 'shield_broken';
  readonly targetId: string;
  readonly sourceId: string;
  readonly skillId?: string;
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
  | HealAppliedEvent
  | SkillUsedEvent
  | TagAppliedEvent
  | TagRemovedEvent
  | TagTickEvent
  | ShieldAppliedEvent
  | ShieldBrokenEvent
  | CombatantKilledEvent
  | TurnStartedEvent
  | TurnEndedEvent
  | BattleWonEvent;

export type BattleEventType = BattleEvent['type'];

/** @deprecated Use TagAppliedEvent */
export type StatusAppliedEvent = TagAppliedEvent;
/** @deprecated Use TagRemovedEvent */
export type StatusRemovedEvent = TagRemovedEvent;
/** @deprecated Use TagTickEvent */
export type StatusTickEvent = TagTickEvent;
