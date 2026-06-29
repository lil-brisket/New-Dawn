import { useEffect } from 'react';
import { router } from 'expo-router';
import { SplashScreen } from '@/features/auth/screens/SplashScreen';
import { useAuthStore } from '@/stores/authStore';
import { AppConstants } from '@/constants/AppConstants';
import { ROUTES } from '@/navigation/routes';

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace(ROUTES.HOME);
      } else {
        router.replace(ROUTES.LOGIN);
      }
    }, AppConstants.SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return <SplashScreen />;
}
