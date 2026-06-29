import type { ReactNode } from 'react';
import { ThemeProvider } from '@dawn/ui';
import { QueryProvider } from '@/providers/QueryProvider';
import { LoadingOverlayHost, ToastHost } from '@/providers/OverlayHosts';
import { Logger } from '@/services/logger/Logger';
import { env } from '@/config/env';

export function AppProviders({ children }: { children: ReactNode }) {
  Logger.info('App environment', env.EXPO_PUBLIC_ENVIRONMENT);

  return (
    <QueryProvider>
      <ThemeProvider>
        {children}
        <LoadingOverlayHost />
        <ToastHost />
      </ThemeProvider>
    </QueryProvider>
  );
}
