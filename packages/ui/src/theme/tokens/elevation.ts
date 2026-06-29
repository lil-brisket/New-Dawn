/** Platform-agnostic elevation levels */
export const elevation = {
  none: 0,
  low: 2,
  medium: 4,
  high: 8,
} as const;

export type Elevation = typeof elevation;
export type ElevationLevel = keyof typeof elevation;
