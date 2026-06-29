import { darkPalette as colors } from './tokens/colors';
import { shadow } from './tokens/shadows';
import { border } from './tokens/border';
import { createButtonVariants, createCardVariants, createPanelVariants } from './components/button';
import { createToastTokens } from './components/toast';

/** @deprecated Remove after Phase 7 — derive styles from primitive tokens in components */
export const componentTokens = {
  button: createButtonVariants(colors),
  card: createCardVariants(colors, { sm: shadow.sm, md: shadow.md }),
  panel: createPanelVariants(colors, { glow: shadow.glow, md: shadow.md }),
  modal: {
    backdrop: { bg: colors.overlay },
    content: {
      bg: colors.surfaceElevated,
      border: colors.border,
      borderWidth: border.thin,
      shadow: shadow.lg,
    },
  },
  toast: createToastTokens(colors),
  bottomNav: {
    active: { text: colors.gold, icon: colors.gold },
    inactive: { text: colors.textMuted, icon: colors.textMuted },
  },
  progressBar: {
    track: colors.surfacePressed,
    fill: colors.primary,
    label: colors.textSecondary,
  },
  avatar: {
    bg: colors.primaryDark,
    text: colors.text,
    online: colors.success,
    offline: colors.textMuted,
  },
} as const;

export type ComponentTokens = typeof componentTokens;
export type { ButtonVariantStyle as ButtonTokens } from './components/button';
