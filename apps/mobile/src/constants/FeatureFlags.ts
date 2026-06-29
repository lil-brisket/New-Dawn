export const FeatureFlags = {
  battle: false,
  guild: false,
  shop: false,
  pvp: false,
  summoning: false,
  events: false,
  debug: __DEV__,
  developerTools: __DEV__,
} as const;

export type FeatureFlagKey = keyof typeof FeatureFlags;
