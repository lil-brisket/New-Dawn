/** Stacking order tokens */
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  modal: 100,
  toast: 200,
  tooltip: 300,
  overlay: 400,
} as const;

export type ZIndex = typeof zIndex;
