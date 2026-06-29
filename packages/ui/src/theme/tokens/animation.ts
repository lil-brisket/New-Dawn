/** Animation primitives — components compose these, no named presets */
export const animation = {
  duration: {
    instant: 0,
    fast: 100,
    normal: 180,
    slow: 300,
    slower: 500,
    /** @deprecated Remove after Phase 7 — use `normal` */
    medium: 180,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    /** @deprecated Remove after Phase 7 — use `easeOut` */
    spring: 'spring',
  },
  spring: {
    snappy: { damping: 12, stiffness: 200, mass: 0.4 },
    gentle: { damping: 20, stiffness: 100, mass: 0.6 },
  },
} as const;

export type Animation = typeof animation;

/** @deprecated Remove after Phase 7 — use `animation` instead */
export const motion = {
  durations: animation.duration,
  easing: animation.easing,
  springs: {
    ...animation.spring,
    buttonPress: animation.spring.snappy,
    modalOpen: animation.spring.gentle,
    toastEnter: { damping: 18, stiffness: 320, mass: 0.5 },
    progressFill: { damping: 22, stiffness: 120, mass: 0.8 },
    default: { damping: 15, stiffness: 150, mass: 0.5 },
  },
} as const;
