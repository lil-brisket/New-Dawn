import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import { analytics } from '@/services/analytics/Analytics';

export function useScreenTracking() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      analytics.trackScreen(pathname);
    }
  }, [pathname]);
}
