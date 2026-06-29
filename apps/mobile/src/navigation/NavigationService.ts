import { router } from 'expo-router';
import { FeatureFlags } from '@/constants/FeatureFlags';
import { ROUTES } from '@/navigation/routes';
import { useNotificationStore } from '@/stores/notificationStore';
import { Logger } from '@/services/logger/Logger';

const ROUTE_FLAGS: Partial<Record<string, keyof typeof FeatureFlags>> = {
  [ROUTES.BATTLE]: 'battle',
  [ROUTES.GUILD]: 'guild',
  [ROUTES.SHOP]: 'shop',
  [ROUTES.SUMMON]: 'summoning',
};

function matchesRoute(target: string, route: string): boolean {
  if (route.startsWith(ROUTES.BATTLE)) {
    return target.startsWith(ROUTES.BATTLE);
  }
  return target === route;
}

export const NavigationService = {
  canEnterRoute(route: string): boolean {
    const flagKey = Object.entries(ROUTE_FLAGS).find(([path]) => matchesRoute(route, path))?.[1];
    if (flagKey && !FeatureFlags[flagKey]) {
      return false;
    }
    return true;
  },

  navigate(route: string): void {
    if (!NavigationService.canEnterRoute(route)) {
      useNotificationStore.getState().showToast('This feature is not available yet.');
      Logger.debug('Navigation blocked', { route });
      return;
    }
    router.push(route as never);
  },

  replace(route: string): void {
    if (!NavigationService.canEnterRoute(route)) {
      useNotificationStore.getState().showToast('This feature is not available yet.');
      return;
    }
    router.replace(route as never);
  },
};
