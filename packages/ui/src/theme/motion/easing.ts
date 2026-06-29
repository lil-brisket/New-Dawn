export const easing = {
  easeOut: 'ease-out',
  easeIn: 'ease-in',
  easeInOut: 'ease-in-out',
  spring: 'spring',
} as const;

export type MotionEasing = typeof easing;
