import { durations } from './durations';
import { easing } from './easing';
import { springs } from './springs';

export const motion = {
  durations,
  easing,
  springs,
} as const;

export type Motion = typeof motion;

export { durations, easing, springs };
