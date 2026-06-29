export const durations = {
  fast: 150,
  medium: 300,
  slow: 500,
} as const;

export type MotionDurations = typeof durations;
