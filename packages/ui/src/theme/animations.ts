import { motion } from './motion';

/** @deprecated Use `motion` from theme instead */
export const animations = {
  duration: {
    fast: motion.durations.fast,
    normal: motion.durations.medium,
    slow: motion.durations.slow,
  },
  easing: {
    easeOut: motion.easing.easeOut,
    easeIn: motion.easing.easeIn,
    spring: motion.easing.spring,
  },
} as const;

export type Animations = typeof animations;
