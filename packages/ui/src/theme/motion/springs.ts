/** Reanimated spring configs — shared physics across all animated components */
export const springs = {
  buttonPress: { damping: 15, stiffness: 400, mass: 0.4 },
  modalOpen: { damping: 20, stiffness: 280, mass: 0.6 },
  toastEnter: { damping: 18, stiffness: 320, mass: 0.5 },
  progressFill: { damping: 22, stiffness: 120, mass: 0.8 },
  /** @deprecated Use named springs above */
  default: { damping: 15, stiffness: 150 },
  gentle: { damping: 20, stiffness: 100 },
  snappy: { damping: 12, stiffness: 200 },
} as const;

export type MotionSprings = typeof springs;
