import { spacing } from './spacing';
import { sizes } from './sizes';
import { icons } from './icons';

/** RPG domain tokens — separate from generic design system */
export const game = {
  battle: {
    hexSize: 18,
    gridSpacing: spacing.sm,
    movementRangeOpacity: 0.32,
    attackRangeOpacity: 0.48,
    floatingDamageOffset: { x: 0, y: -12 },
    actionBarHeight: sizes.bottomNav,
    healthBarHeight: sizes.progressBar.sm,
    healthBarHeightLg: sizes.progressBar.md,
    statusEffectIconSize: icons.sm,
    floatingCombatTextSize: 14,
  },
  inventory: {
    slotSize: sizes.inventorySlot,
    equipmentSlotSize: 80,
    slotGap: spacing.sm,
    gridColumns: 4,
  },
  guild: {
    bannerHeight: 120,
    memberAvatarSize: 40,
    emblemSize: sizes.avatar.md,
  },
  world: {
    gridSize: 18,
    interactionRadius: sizes.touchTarget,
    mapTileSize: 32,
  },
  effects: {
    rarityGlow: {
      common: 0,
      uncommon: 0.15,
      rare: 0.25,
      epic: 0.35,
      legendary: 0.5,
      mythic: 0.65,
    },
    damageIndicatorOffset: { x: 0, y: -8 },
    healIndicatorOffset: { x: 0, y: -8 },
  },
} as const;

export type Game = typeof game;
