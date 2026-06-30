import type { BattleEvent } from '@dawn/types';

export interface AnimationStep {
  type: string;
  duration: number;
  entityId?: string;
  animationKey?: string;
  soundKey?: string;
  payload?: Record<string, unknown>;
}

const DEFAULT_DURATION = 400;

export function battleEventToAnimationSteps(event: BattleEvent): AnimationStep[] {
  switch (event.type) {
    case 'combatant_moved':
      return [
        {
          type: 'move',
          duration: DEFAULT_DURATION,
          entityId: event.combatantId,
        },
      ];
    case 'damage_dealt':
      return [
        {
          type: 'damage',
          duration: DEFAULT_DURATION,
          entityId: event.targetId,
          payload: { amount: event.amount, sourceId: event.sourceId },
        },
      ];
    case 'combatant_killed':
      return [
        {
          type: 'death',
          duration: DEFAULT_DURATION * 2,
          entityId: event.combatantId,
          payload: { killerId: event.killerId },
        },
      ];
    case 'turn_started':
    case 'turn_ended':
    case 'battle_won':
      return [];
    default:
      return [];
  }
}
