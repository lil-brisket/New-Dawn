import { colors } from './colors';
import { spacing } from './spacing';
import { radius } from './radius';

/** Tailwind theme.extend values synced from @dawn/ui tokens */
export const tailwindTheme = {
  colors: {
    primary: colors.primary,
    'primary-light': colors.primaryLight,
    'primary-dark': colors.primaryDark,
    accent: colors.accent,
    danger: colors.danger,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
    surface: colors.surface,
    'surface-elevated': colors.surfaceElevated,
    'surface-glass': colors.surfaceGlass,
    border: colors.border,
    'border-strong': colors.borderStrong,
    'text-primary': colors.textPrimary,
    'text-secondary': colors.textSecondary,
    'text-muted': colors.textMuted,
  },
  spacing: {
    0.5: `${spacing[2]}px`,
    1: `${spacing[4]}px`,
    2: `${spacing[8]}px`,
    3: `${spacing[12]}px`,
    4: `${spacing[16]}px`,
    5: `${spacing[20]}px`,
    6: `${spacing[24]}px`,
    8: `${spacing[32]}px`,
    10: `${spacing[40]}px`,
    12: `${spacing[48]}px`,
    16: `${spacing[64]}px`,
  },
  borderRadius: {
    xs: `${radius.xs}px`,
    sm: `${radius.sm}px`,
    md: `${radius.md}px`,
    lg: `${radius.lg}px`,
    xl: `${radius.xl}px`,
    pill: `${radius.pill}px`,
    circle: `${radius.circle}px`,
  },
};
