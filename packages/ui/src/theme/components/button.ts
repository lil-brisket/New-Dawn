import type { ColorPalette } from '../tokens/colors';
import { border } from '../tokens/border';
import { opacity } from '../tokens/opacity';
import type { Shadow } from '../tokens/shadows';
import type { ButtonVariant } from '../../components/ui/Button/Button.types';
import type { CardVariant } from '../../components/ui/Card/Card.types';
import type { PanelVariant } from '../../components/ui/Panel/Panel.types';

export interface ButtonVariantStyle {
  bg: string;
  text: string;
  border: string;
  borderWidth: number;
  pressedBg: string;
  disabledOpacity: number;
}

export interface SurfaceVariantStyle {
  bg: string;
  border: string;
  borderWidth: number;
  shadow?: Shadow[keyof Shadow];
}

function withAlpha(hex: string, alpha: number): string {
  if (hex.startsWith('rgba')) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function createButtonVariants(
  colors: ColorPalette,
): Record<ButtonVariant, ButtonVariantStyle> {
  return {
    primary: {
      bg: colors.primary,
      text: colors.text,
      border: colors.primary,
      borderWidth: 0,
      pressedBg: colors.primaryDark,
      disabledOpacity: opacity.disabled + 0.1,
    },
    secondary: {
      bg: colors.surfacePressed,
      text: colors.text,
      border: colors.border,
      borderWidth: border.thin,
      pressedBg: colors.surfaceElevated,
      disabledOpacity: opacity.disabled + 0.1,
    },
    danger: {
      bg: colors.error,
      text: colors.text,
      border: colors.error,
      borderWidth: 0,
      pressedBg: colors.error,
      disabledOpacity: opacity.disabled + 0.1,
    },
    success: {
      bg: colors.success,
      text: colors.surface,
      border: colors.success,
      borderWidth: 0,
      pressedBg: colors.success,
      disabledOpacity: opacity.disabled + 0.1,
    },
    ghost: {
      bg: colors.transparent,
      text: colors.primaryLight,
      border: colors.transparent,
      borderWidth: 0,
      pressedBg: withAlpha(colors.primary, opacity.selected),
      disabledOpacity: opacity.disabled,
    },
    outline: {
      bg: colors.transparent,
      text: colors.primaryLight,
      border: colors.primary,
      borderWidth: border.thin,
      pressedBg: withAlpha(colors.primary, opacity.selected),
      disabledOpacity: opacity.disabled,
    },
  };
}

export function createCardVariants(
  colors: ColorPalette,
  shadow: { sm: SurfaceVariantStyle['shadow']; md: SurfaceVariantStyle['shadow'] },
): Record<CardVariant, SurfaceVariantStyle> {
  return {
    default: {
      bg: colors.surfacePressed,
      border: colors.border,
      borderWidth: border.thin,
      shadow: shadow.sm,
    },
    elevated: {
      bg: colors.surfacePressed,
      border: colors.border,
      borderWidth: 0,
      shadow: shadow.md,
    },
    outlined: {
      bg: colors.transparent,
      border: colors.border,
      borderWidth: border.thin,
      shadow: undefined,
    },
  };
}

export function createPanelVariants(
  colors: ColorPalette,
  shadow: {
    glow: SurfaceVariantStyle['shadow'];
    md: SurfaceVariantStyle['shadow'];
  },
): Record<PanelVariant, SurfaceVariantStyle> {
  return {
    default: {
      bg: colors.surfacePressed,
      border: colors.border,
      borderWidth: border.thin,
      shadow: shadow.glow,
    },
    elevated: {
      bg: colors.surfaceElevated,
      border: colors.borderStrong,
      borderWidth: border.thin,
      shadow: shadow.md,
    },
    outlined: {
      bg: colors.transparent,
      border: colors.border,
      borderWidth: border.thin,
      shadow: undefined,
    },
  };
}
