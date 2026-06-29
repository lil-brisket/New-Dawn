import { useEffect } from 'react';
import { router } from 'expo-router';
import { SplashScreen } from '@/features/auth/screens/SplashScreen';
import { useAuthStore } from '@/stores/authStore';

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(main)/home');
      } else {
        router.replace('/(auth)/login');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return <SplashScreen />;
}
