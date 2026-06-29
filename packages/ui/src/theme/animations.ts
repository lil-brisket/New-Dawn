export const animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeOut: 'ease-out',
    easeIn: 'ease-in',
    spring: 'spring',
  },
} as const;

export type Animations = typeof animations;
