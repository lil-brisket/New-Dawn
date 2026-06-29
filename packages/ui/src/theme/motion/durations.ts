export const durations = {
  fast: 100,
  normal: 180,
  slow: 300,
  /** @deprecated Use `normal` instead */
  medium: 180,
} as const;

export type MotionDurations = typeof durations;
