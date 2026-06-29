import { animation } from '../../theme/tokens/animation';

/** @deprecated Remove after Phase 7 — use `animation.spring` from tokens */
export const springs = {
  ...animation.spring,
  buttonPress: animation.spring.snappy,
  modalOpen: animation.spring.gentle,
  toastEnter: { damping: 18, stiffness: 320, mass: 0.5 },
  progressFill: { damping: 22, stiffness: 120, mass: 0.8 },
  default: { damping: 15, stiffness: 150, mass: 0.5 },
} as const;

export type MotionSprings = typeof springs;
