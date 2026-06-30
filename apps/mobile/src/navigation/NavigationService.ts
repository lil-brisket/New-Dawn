import { router } from 'expo-router';
import { toast } from '@dawn/ui';
import { FeatureFlags } from '@/constants/FeatureFlags';
import { ROUTES } from '@/navigation/routes';
import { Logger } from '@/services/logger/Logger';

const ROUTE_FLAGS: Partial<Record<string, keyof typeof FeatureFlags>> = {
  [ROUTES.BATTLE_SANDBOX]: 'developerTools',
  [ROUTES.BATTLE]: 'battle',
  [ROUTES.GUILD]: 'guild',
  [ROUTES.SHOP]: 'shop',
  [ROUTES.SUMMON]: 'summoning',
};

function matchesRoute(target: string, route: string): boolean {
  if (route === ROUTES.BATTLE_SANDBOX) {
    return target === ROUTES.BATTLE_SANDBOX;
  }
  if (route === ROUTES.BATTLE) {
    return target.startsWith(`${ROUTES.BATTLE}/`) && target !== ROUTES.BATTLE_SANDBOX;
  }
  return target === route;
}

function resolveRouteFlag(route: string): keyof typeof FeatureFlags | undefined {
  return Object.entries(ROUTE_FLAGS)
    .sort(([a], [b]) => b.length - a.length)
    .find(([path]) => matchesRoute(route, path))?.[1];
}

export const NavigationService = {
  canEnterRoute(route: string): boolean {
    const flagKey = resolveRouteFlag(route);
    if (flagKey && !FeatureFlags[flagKey]) {
      return false;
    }
    return true;
  },

  navigate(route: string): void {
    if (!NavigationService.canEnterRoute(route)) {
      toast.info('This feature is not available yet.');
      Logger.debug('Navigation blocked', { route });
      return;
    }
    router.push(route as never);
  },

  replace(route: string): void {
    if (!NavigationService.canEnterRoute(route)) {
      toast.info('This feature is not available yet.');
      return;
    }
    router.replace(route as never);
  },
};
