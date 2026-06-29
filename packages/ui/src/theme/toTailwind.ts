import type { ColorPalette } from './tokens/colors';
import { darkPalette, lightPalette } from './tokens/colors';
import { spacing } from './tokens/spacing';
import { radius } from './tokens/radius';
import { typography } from './tokens/typography';
import { opacity } from './tokens/opacity';

function paletteToTailwindColors(palette: ColorPalette) {
  return {
    primary: palette.primary,
    'primary-light': palette.primaryLight,
    'primary-dark': palette.primaryDark,
    secondary: palette.secondary,
    gold: palette.gold,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info,
    surface: palette.surface,
    'surface-elevated': palette.surfaceElevated,
    'surface-glass': palette.surfaceGlass,
    border: palette.border,
    'border-strong': palette.borderStrong,
    text: palette.text,
    'text-muted': palette.textMuted,
    background: palette.background,
  };
}

/** Tailwind theme.extend values synced from @dawn/ui tokens */
export const tailwindTheme = {
  colors: {
    ...paletteToTailwindColors(darkPalette),
    light: paletteToTailwindColors(lightPalette),
  },
  spacing: {
    0: `${spacing[0]}px`,
    0.5: `${spacing[2]}px`,
    1: `${spacing[4]}px`,
    2: `${spacing[8]}px`,
    3: `${spacing[12]}px`,
    4: `${spacing[16]}px`,
    5: `${spacing[20]}px`,
    6: `${spacing[24]}px`,
    7: `${spacing[32]}px`,
    8: `${spacing[40]}px`,
    9: `${spacing[48]}px`,
    10: `${spacing[56]}px`,
    12: `${spacing[64]}px`,
    14: `${spacing[72]}px`,
    16: `${spacing[80]}px`,
    20: `${spacing[96]}px`,
    24: `${spacing[128]}px`,
  },
  borderRadius: {
    none: `${radius.none}px`,
    xs: `${radius.xs}px`,
    sm: `${radius.sm}px`,
    md: `${radius.md}px`,
    lg: `${radius.lg}px`,
    xl: `${radius.xl}px`,
    '2xl': `${radius['2xl']}px`,
    pill: `${radius.pill}px`,
    circle: `${radius.circle}px`,
  },
  fontSize: Object.fromEntries(
    Object.entries(typography.fontSize).map(([key, value]) => [key, `${value}px`]),
  ),
  opacity: {
    disabled: opacity.disabled,
    pressed: opacity.pressed,
    overlay: opacity.overlay,
    backdrop: opacity.backdrop,
  },
};
