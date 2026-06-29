import { createContext, useContext, type ReactNode } from 'react';
import { colors } from './colors';
import { semantic } from './semantic';
import { spacing } from './spacing';
import { radius } from './radius';
import { typography } from './typography';
import { shadows } from './shadows';
import { animations } from './animations';
import { motion } from './motion';
import { sizes } from './sizes';
import { icons } from './icons';
import { safeArea } from './safeArea';
import { componentTokens } from './components';

export const theme = {
  colors,
  semantic,
  spacing,
  radius,
  typography,
  shadows,
  animations,
  motion,
  sizes,
  icons,
  safeArea,
  components: componentTokens,
} as const;

export type Theme = typeof theme;

const ThemeContext = createContext<Theme>(theme);

export function ThemeProvider({ children, value = theme }: { children: ReactNode; value?: Theme }) {
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

export {
  colors,
  semantic,
  spacing,
  radius,
  typography,
  shadows,
  animations,
  motion,
  sizes,
  icons,
  safeArea,
  componentTokens,
};
