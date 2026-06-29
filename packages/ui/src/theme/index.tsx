import { createContext, useContext, type ReactNode } from 'react';
import { colors } from './colors';
import { spacing } from './spacing';
import { radius } from './radius';
import { typography } from './typography';
import { shadows } from './shadows';
import { animations } from './animations';
import { sizes } from './sizes';
import { icons } from './icons';
import { safeArea } from './safeArea';

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
  animations,
  sizes,
  icons,
  safeArea,
} as const;

export type Theme = typeof theme;

const ThemeContext = createContext<Theme>(theme);

export function ThemeProvider({ children, value = theme }: { children: ReactNode; value?: Theme }) {
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

export { colors, spacing, radius, typography, shadows, animations, sizes, icons, safeArea };
