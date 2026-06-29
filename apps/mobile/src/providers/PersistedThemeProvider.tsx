import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { ThemeProvider, type ThemePreference } from '@dawn/ui';
import { appStorage } from '@/services/storage/index.native';

const STORAGE_KEY = '@dawn/theme-mode';

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function PersistedThemeProvider({ children }: { children: ReactNode }) {
  const [initialPreference, setInitialPreference] = useState<ThemePreference | null>(null);

  useEffect(() => {
    void appStorage.getItem(STORAGE_KEY).then((stored) => {
      setInitialPreference(isThemePreference(stored) ? stored : 'system');
    });
  }, []);

  const onPreferenceChange = useCallback((mode: ThemePreference) => {
    void appStorage.setItem(STORAGE_KEY, mode);
  }, []);

  if (initialPreference === null) {
    return null;
  }

  return (
    <ThemeProvider initialPreference={initialPreference} onPreferenceChange={onPreferenceChange}>
      {children}
    </ThemeProvider>
  );
}
