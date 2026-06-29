import type { ReactNode } from 'react';
import { ThemeProvider, ToastProvider } from '@dawn/ui';
import { QueryProvider } from '@/providers/QueryProvider';
import { LoadingOverlayHost } from '@/providers/OverlayHosts';
import { Logger } from '@/services/logger/Logger';
import { env } from '@/config/env';

export function AppProviders({ children }: { children: ReactNode }) {
  Logger.info('App environment', env.EXPO_PUBLIC_ENVIRONMENT);

  return (
    <QueryProvider>
      <ThemeProvider>
        <ToastProvider>
          {children}
          <LoadingOverlayHost />
        </ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
