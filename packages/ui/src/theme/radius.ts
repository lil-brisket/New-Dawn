export const radius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  pill: 9999,
  circle: 9999,
  /** @deprecated Use `pill` instead */
  full: 9999,
} as const;

export type Radius = typeof radius;
