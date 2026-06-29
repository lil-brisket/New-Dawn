import type { ReactNode } from 'react';
import { ToastProvider } from '@dawn/ui';
import { PersistedThemeProvider } from '@/providers/PersistedThemeProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { LoadingOverlayHost } from '@/providers/OverlayHosts';
import { Logger } from '@/services/logger/Logger';
import { env } from '@/config/env';

export function AppProviders({ children }: { children: ReactNode }) {
  Logger.info('App environment', env.EXPO_PUBLIC_ENVIRONMENT);

  return (
    <QueryProvider>
      <PersistedThemeProvider>
        <ToastProvider>
          {children}
          <LoadingOverlayHost />
        </ToastProvider>
      </PersistedThemeProvider>
    </QueryProvider>
  );
}
