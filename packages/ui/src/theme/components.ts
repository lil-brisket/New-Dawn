import { colors } from './colors';
import { shadows } from './shadows';

export interface ButtonTokens {
  bg: string;
  text: string;
  border: string;
  borderWidth: number;
  pressedBg: string;
  disabledOpacity: number;
}

export interface SurfaceTokens {
  bg: string;
  border: string;
  borderWidth: number;
  shadow?: (typeof shadows)[keyof typeof shadows];
}

export interface ToastTokens {
  bg: string;
  text: string;
  accent: string;
}

export const componentTokens = {
  button: {
    primary: {
      bg: colors.primary,
      text: colors.textPrimary,
      border: colors.primary,
      borderWidth: 0,
      pressedBg: colors.primaryDark,
      disabledOpacity: 0.5,
    },
    secondary: {
      bg: colors.surfacePressed,
      text: colors.textPrimary,
      border: colors.border,
      borderWidth: 1,
      pressedBg: colors.surfaceElevated,
      disabledOpacity: 0.5,
    },
    danger: {
      bg: colors.danger,
      text: colors.textPrimary,
      border: colors.danger,
      borderWidth: 0,
      pressedBg: '#DC2626',
      disabledOpacity: 0.5,
    },
    success: {
      bg: colors.success,
      text: colors.surface,
      border: colors.success,
      borderWidth: 0,
      pressedBg: '#22C55E',
      disabledOpacity: 0.5,
    },
    ghost: {
      bg: 'transparent',
      text: colors.primaryLight,
      border: 'transparent',
      borderWidth: 0,
      pressedBg: 'rgba(107, 78, 255, 0.12)',
      disabledOpacity: 0.4,
    },
    outline: {
      bg: 'transparent',
      text: colors.primaryLight,
      border: colors.primary,
      borderWidth: 1,
      pressedBg: 'rgba(107, 78, 255, 0.12)',
      disabledOpacity: 0.4,
    },
  } satisfies Record<string, ButtonTokens>,

  card: {
    default: {
      bg: colors.surfacePressed,
      border: colors.border,
      borderWidth: 1,
      shadow: shadows.sm,
    },
    elevated: {
      bg: colors.surfacePressed,
      border: colors.border,
      borderWidth: 0,
      shadow: shadows.md,
    },
    outlined: {
      bg: 'transparent',
      border: colors.border,
      borderWidth: 1,
      shadow: undefined,
    },
  } satisfies Record<string, SurfaceTokens>,

  panel: {
    default: {
      bg: colors.surfacePressed,
      border: colors.border,
      borderWidth: 1,
      shadow: shadows.glow,
    },
    elevated: {
      bg: colors.surfaceElevated,
      border: colors.borderStrong,
      borderWidth: 1,
      shadow: shadows.md,
    },
    outlined: {
      bg: 'transparent',
      border: colors.border,
      borderWidth: 1,
      shadow: undefined,
    },
  } satisfies Record<string, SurfaceTokens>,

  modal: {
    backdrop: { bg: colors.overlay },
    content: {
      bg: colors.surfaceElevated,
      border: colors.border,
      borderWidth: 1,
      shadow: shadows.lg,
    },
  },

  toast: {
    success: {
      bg: colors.surfaceElevated,
      text: colors.textPrimary,
      accent: colors.success,
    },
    warning: {
      bg: colors.surfaceElevated,
      text: colors.textPrimary,
      accent: colors.warning,
    },
    error: {
      bg: colors.surfaceElevated,
      text: colors.textPrimary,
      accent: colors.danger,
    },
    info: {
      bg: colors.surfaceElevated,
      text: colors.textPrimary,
      accent: colors.info,
    },
  } satisfies Record<string, ToastTokens>,

  bottomNav: {
    active: { text: colors.accent, icon: colors.accent },
    inactive: { text: colors.textMuted, icon: colors.textMuted },
  },

  progressBar: {
    track: colors.surfacePressed,
    fill: colors.primary,
    label: colors.textSecondary,
  },

  avatar: {
    bg: colors.primaryDark,
    text: colors.textPrimary,
    online: colors.success,
    offline: colors.textMuted,
  },
} as const;

export type ComponentTokens = typeof componentTokens;
