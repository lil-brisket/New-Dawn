import { create } from 'zustand';
import type { BattleState, BattleLogEntry } from '@dawn/types';
import type { AnimationStep } from '@/features/battle/presentation/AnimationStep';

interface BattleStoreState {
  snapshot: BattleState | null;
  battleLog: BattleLogEntry[];
  animationQueue: AnimationStep[];
  isAnimating: boolean;
  setSnapshot: (snapshot: BattleState | null) => void;
  setBattleLog: (log: BattleLogEntry[]) => void;
  enqueueAnimations: (steps: AnimationStep[]) => void;
  dequeueAnimation: () => AnimationStep | undefined;
  setIsAnimating: (value: boolean) => void;
  reset: () => void;
}

export const useBattleStore = create<BattleStoreState>((set, get) => ({
  snapshot: null,
  battleLog: [],
  animationQueue: [],
  isAnimating: false,
  setSnapshot: (snapshot) => set({ snapshot }),
  setBattleLog: (battleLog) => set({ battleLog }),
  enqueueAnimations: (steps) => set((s) => ({ animationQueue: [...s.animationQueue, ...steps] })),
  dequeueAnimation: () => {
    const queue = get().animationQueue;
    if (queue.length === 0) return undefined;
    const [next, ...rest] = queue;
    set({ animationQueue: rest });
    return next;
  },
  setIsAnimating: (isAnimating) => set({ isAnimating }),
  reset: () => set({ snapshot: null, battleLog: [], animationQueue: [], isAnimating: false }),
}));
