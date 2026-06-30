import { useEffect, useRef } from 'react';
import type { BattleEvent } from '@dawn/types';
import { useBattleStore } from '@/stores/battleStore';
import { AnimationQueue } from './AnimationQueue';
import { battleEventToAnimationSteps } from './AnimationStep';

/** Processes domain battle events from the store into the animation queue. */
export function useBattleAnimations(events: readonly BattleEvent[] | null) {
  const queueRef = useRef(new AnimationQueue());
  const setIsAnimating = useBattleStore((s) => s.setIsAnimating);

  useEffect(() => {
    if (!events || events.length === 0) return;

    queueRef.current.setStepHandler(async (step) => {
      setIsAnimating(true);
      await new Promise<void>((resolve) => setTimeout(() => resolve(), step.duration));
      setIsAnimating(false);
    });

    for (const event of events) {
      const steps = battleEventToAnimationSteps(event);
      queueRef.current.enqueue(steps);
      useBattleStore.getState().enqueueAnimations(steps);
    }
  }, [events, setIsAnimating]);
}
