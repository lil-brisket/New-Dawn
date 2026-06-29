export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function percentOf(value: number, total: number): number {
  if (total === 0) return 0;
  return value / total;
}
