export const sizes = {
  button: { xs: 28, sm: 32, md: 44, lg: 52 },
  avatar: { xs: 24, sm: 32, md: 48, lg: 64, xl: 96 },
  icon: { sm: 16, md: 24, lg: 32 },
  progressBar: { sm: 6, md: 8, lg: 12 },
  touchTarget: 44,
  topBar: 56,
  bottomNav: 64,
  inventorySlot: 72,
} as const;

export type Sizes = typeof sizes;
