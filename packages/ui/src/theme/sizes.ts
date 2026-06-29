export const sizes = {
  button: { sm: 32, md: 44, lg: 52 },
  avatar: { sm: 32, md: 48, lg: 64, xl: 96 },
  icon: { sm: 16, md: 24, lg: 32 },
  touchTarget: 44,
  topBar: 56,
  bottomNav: 64,
  inventorySlot: 72,
} as const;

export type Sizes = typeof sizes;
