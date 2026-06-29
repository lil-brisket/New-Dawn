import type { ColorPalette } from '../tokens/colors';
import { border } from '../tokens/border';

export interface ToastVariantTokens {
  bg: string;
  text: string;
  accent: string;
  accentBorderWidth: number;
}

export function createToastTokens(colors: ColorPalette) {
  const base = {
    bg: colors.surfaceElevated,
    text: colors.text,
    accentBorderWidth: border.thick,
  };

  return {
    success: { ...base, accent: colors.success },
    warning: { ...base, accent: colors.warning },
    error: { ...base, accent: colors.error },
    info: { ...base, accent: colors.info },
  } as const satisfies Record<string, ToastVariantTokens>;
}

export type ToastTokens = ReturnType<typeof createToastTokens>;
