/** Reanimated spring configs */
export const springs = {
  default: { damping: 15, stiffness: 150 },
  gentle: { damping: 20, stiffness: 100 },
  snappy: { damping: 12, stiffness: 200 },
} as const;

export type MotionSprings = typeof springs;
