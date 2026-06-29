import { useEffect, useRef } from 'react';
import type { BattleEvent } from '@dawn/types';
import type { EventBus } from '@dawn/game-core';
import { useBattleStore } from '@/stores/battleStore';
import { AnimationQueue } from './AnimationQueue';
import { battleEventToAnimationSteps } from './AnimationStep';

export function useBattleAnimations(eventBus: EventBus<BattleEvent> | null) {
  const queueRef = useRef(new AnimationQueue());
  const setIsAnimating = useBattleStore((s) => s.setIsAnimating);

  useEffect(() => {
    if (!eventBus) return;

    queueRef.current.setStepHandler(async (step) => {
      setIsAnimating(true);
      await new Promise<void>((resolve) => setTimeout(() => resolve(), step.duration));
      setIsAnimating(false);
    });

    const handlers: Array<() => void> = [];

    const eventTypes = [
      'player_moved',
      'damage_taken',
      'skill_used',
      'enemy_died',
      'buff_applied',
    ] as const;

    for (const type of eventTypes) {
      const unsub = eventBus.subscribe(type, (event) => {
        const steps = battleEventToAnimationSteps(event);
        queueRef.current.enqueue(steps);
        useBattleStore.getState().enqueueAnimations(steps);
      });
      handlers.push(unsub);
    }

    return () => handlers.forEach((u) => u());
  }, [eventBus, setIsAnimating]);
}
