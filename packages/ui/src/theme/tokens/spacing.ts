/** 8-point spacing scale */
const scale = {
  0: 0,
  2: 2,
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
  48: 48,
  56: 56,
  64: 64,
  72: 72,
  80: 80,
  96: 96,
  128: 128,
} as const;

export const spacing = {
  ...scale,
  xs: scale[4],
  sm: scale[8],
  md: scale[12],
  lg: scale[16],
  xl: scale[24],
  '2xl': scale[32],
  '3xl': scale[48],
  '4xl': scale[64],
} as const;

export type Spacing = typeof spacing;
