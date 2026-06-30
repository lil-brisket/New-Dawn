import {
  spacing,
  typography,
  radius,
  sizes,
  icons,
  border,
  opacity,
  layout,
  elevation,
  animation,
  zIndex,
  game,
  getPalette,
  createBattleTokens,
  type ThemeMode,
} from './tokens';
import { createShadowTokens } from './tokens/shadows';

export type { ThemeMode, ThemePreference, ColorPalette } from './tokens/colors';

export function createTheme(mode: ThemeMode) {
  const colors = getPalette(mode);
  const battleTokens = createBattleTokens(colors);

  return {
    mode,
    colors,
    spacing,
    typography,
    radius,
    sizes,
    icons,
    border,
    opacity,
    layout,
    elevation,
    shadow: createShadowTokens(colors),
    animation,
    zIndex,
    game: {
      ...game,
      battle: battleTokens,
    },
    /** @deprecated Remove after Phase 7 — use `shadow` */
    shadows: createShadowTokens(colors),
    /** @deprecated Remove after Phase 7 — use `animation` */
    motion: animation,
    /** @deprecated Remove after Phase 7 — use `layout` */
    safeArea: layout,
    /** @deprecated Remove after Phase 7 — use `colors` directly */
    semantic: colors,
  } as const;
}

export type Theme = ReturnType<typeof createTheme>;

export const themes = {
  light: createTheme('light'),
  dark: createTheme('dark'),
} as const;

/** Default dark theme instance */
export const theme = themes.dark;
