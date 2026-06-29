/** Interaction and state opacity tokens */
export const opacity = {
  disabled: 0.4,
  pressed: 0.85,
  hover: 0.92,
  overlay: 0.85,
  backdrop: 0.72,
  selected: 0.12,
  dragging: 0.64,
} as const;

export type Opacity = typeof opacity;
