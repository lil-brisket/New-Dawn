export const radius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  '2xl': 32,
  pill: 9999,
  circle: 9999,
  /** @deprecated Remove after Phase 7 — use `pill` instead */
  full: 9999,
} as const;

export type Radius = typeof radius;
