import { create } from 'zustand';
import type { BattleState, BattleEvent } from '@dawn/types';
import type { AnimationStep } from '@/features/battle/presentation/AnimationStep';

interface BattleStoreState {
  snapshot: BattleState | null;
  lastEvents: BattleEvent[];
  animationQueue: AnimationStep[];
  isAnimating: boolean;
  setSnapshot: (snapshot: BattleState | null) => void;
  setLastEvents: (events: BattleEvent[]) => void;
  enqueueAnimations: (steps: AnimationStep[]) => void;
  dequeueAnimation: () => AnimationStep | undefined;
  setIsAnimating: (value: boolean) => void;
  reset: () => void;
}

export const useBattleStore = create<BattleStoreState>((set, get) => ({
  snapshot: null,
  lastEvents: [],
  animationQueue: [],
  isAnimating: false,
  setSnapshot: (snapshot) => set({ snapshot }),
  setLastEvents: (lastEvents) => set({ lastEvents }),
  enqueueAnimations: (steps) => set((s) => ({ animationQueue: [...s.animationQueue, ...steps] })),
  dequeueAnimation: () => {
    const queue = get().animationQueue;
    if (queue.length === 0) return undefined;
    const [next, ...rest] = queue;
    set({ animationQueue: rest });
    return next;
  },
  setIsAnimating: (isAnimating) => set({ isAnimating }),
  reset: () => set({ snapshot: null, lastEvents: [], animationQueue: [], isAnimating: false }),
}));
