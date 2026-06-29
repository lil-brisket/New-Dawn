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
    case 'player_moved':
      return [
        {
          type: 'move',
          duration: DEFAULT_DURATION,
          entityId: event.entityId,
          animationKey: event.animationKey,
          soundKey: event.soundKey,
        },
      ];
    case 'damage_taken':
      return [
        {
          type: 'damage',
          duration: DEFAULT_DURATION,
          entityId: event.targetId,
          animationKey: event.animationKey,
          soundKey: event.soundKey,
          payload: { amount: event.amount, isCritical: event.isCritical },
        },
      ];
    case 'skill_used':
      return [
        {
          type: 'skill',
          duration: DEFAULT_DURATION * 1.5,
          entityId: event.actorId,
          animationKey: event.animationKey,
          soundKey: event.soundKey,
        },
      ];
    case 'enemy_died':
      return [
        {
          type: 'death',
          duration: DEFAULT_DURATION * 2,
          entityId: event.entityId,
          animationKey: event.animationKey,
          soundKey: event.soundKey,
        },
      ];
    default:
      return [];
  }
}
