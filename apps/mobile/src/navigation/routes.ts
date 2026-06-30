export const ROUTES = {
  SPLASH: '/',
  LOGIN: '/(auth)/login',
  HOME: '/(main)/home',
  WORLD: '/(main)/world',
  BATTLE: '/battle',
  BATTLE_SANDBOX: '/battle/sandbox',
  INVENTORY: '/(main)/inventory',
  CHARACTERS: '/(main)/characters',
  GUILD: '/(main)/guild',
  SHOP: '/(main)/shop',
  SUMMON: '/(main)/summon',
  QUESTS: '/(main)/quests',
  PROFILE: '/(main)/profile',
  SETTINGS: '/(main)/settings',
  DEVELOPER: '/(main)/developer',
  DEVELOPER_UI_SHOWCASE: '/(main)/developer/ui-showcase',
  DEVELOPER_COMPONENT_PLAYGROUND: '/(main)/developer/component-playground',
  DEVELOPER_THEME_PREVIEW: '/(main)/developer/theme-preview',
  DEVELOPER_BATTLE_SANDBOX: '/battle/sandbox',
} as const;

export const RouteNames = ROUTES;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
