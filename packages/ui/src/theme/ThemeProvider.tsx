import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { createTheme, themes, type Theme } from './createTheme';
import type { ThemeMode, ThemePreference } from './tokens/colors';

export interface ThemeContextValue {
  theme: Theme;
  /** User preference: light, dark, or system */
  mode: ThemePreference;
  /** Resolved palette mode after applying system preference */
  resolvedMode: ThemeMode;
  setMode: (mode: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveMode(
  preference: ThemePreference,
  systemScheme: string | null | undefined,
): ThemeMode {
  if (preference === 'system') {
    return systemScheme === 'light' ? 'light' : 'dark';
  }
  return preference;
}

export interface ThemeProviderProps {
  children: ReactNode;
  /** Hydrate preference from persisted storage */
  initialPreference?: ThemePreference;
  /** Called when preference changes — used by PersistedThemeProvider */
  onPreferenceChange?: (mode: ThemePreference) => void;
}

export function ThemeProvider({
  children,
  initialPreference = 'system',
  onPreferenceChange,
}: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>(initialPreference);

  const resolvedMode = resolveMode(preference, systemScheme);

  const setMode = useCallback(
    (mode: ThemePreference) => {
      setPreference(mode);
      onPreferenceChange?.(mode);
    },
    [onPreferenceChange],
  );

  const theme = useMemo(() => createTheme(resolvedMode), [resolvedMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, mode: preference, resolvedMode, setMode }),
    [theme, preference, resolvedMode, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: themes.dark,
      mode: 'dark',
      resolvedMode: 'dark',
      setMode: () => undefined,
    };
  }
  return ctx;
}

/** Test-only helper — override theme without provider props */
export function createTestThemeContext(overrides?: Partial<ThemeContextValue>): ThemeContextValue {
  const theme = overrides?.theme ?? themes.dark;
  return {
    theme,
    mode: overrides?.mode ?? 'dark',
    resolvedMode: overrides?.resolvedMode ?? 'dark',
    setMode: overrides?.setMode ?? (() => undefined),
  };
}
