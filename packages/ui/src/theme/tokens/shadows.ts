import type { ColorPalette } from './colors';
import { darkPalette } from './colors';
import { elevation, type ElevationLevel } from './elevation';

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

const SHADOW_COLOR = darkPalette.black;

const elevationConfig: Record<
  ElevationLevel,
  { offsetY: number; opacity: number; radius: number }
> = {
  none: { offsetY: 0, opacity: 0, radius: 0 },
  low: { offsetY: 2, opacity: 0.15, radius: 4 },
  medium: { offsetY: 4, opacity: 0.2, radius: 8 },
  high: { offsetY: 8, opacity: 0.25, radius: 16 },
};

/** Resolves an elevation level to React Native shadow props */
export function resolveShadow(level: ElevationLevel, shadowColor = SHADOW_COLOR): ShadowStyle {
  const config = elevationConfig[level];
  return {
    shadowColor,
    shadowOffset: { width: 0, height: config.offsetY },
    shadowOpacity: config.opacity,
    shadowRadius: config.radius,
    elevation: elevation[level],
  };
}

function createShadowToken(level: ElevationLevel, shadowColor = SHADOW_COLOR) {
  return resolveShadow(level, shadowColor);
}

/** Pre-resolved shadow tokens for StyleSheet usage */
export const shadow = {
  none: createShadowToken('none'),
  sm: createShadowToken('low'),
  md: createShadowToken('medium'),
  lg: createShadowToken('high'),
  xl: createShadowToken('high'),
  glow: {
    shadowColor: darkPalette.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

export type Shadow = typeof shadow;

/** @deprecated Remove after Phase 7 — use `shadow` instead */
export const shadows = shadow;

export function createShadowTokens(palette: Pick<ColorPalette, 'black' | 'primary'>) {
  return {
    none: resolveShadow('none', palette.black),
    sm: resolveShadow('low', palette.black),
    md: resolveShadow('medium', palette.black),
    lg: resolveShadow('high', palette.black),
    xl: resolveShadow('high', palette.black),
    glow: {
      shadowColor: palette.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 6,
    },
  } as const;
}
