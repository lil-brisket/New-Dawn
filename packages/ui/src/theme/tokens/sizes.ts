/** Component dimension tokens — no icons or border widths */
export const sizes = {
  button: { xs: 28, sm: 32, md: 44, lg: 52 },
  avatar: { xs: 24, sm: 32, md: 48, lg: 64, xl: 96 },
  progressBar: { sm: 6, md: 8, lg: 12 },
  touchTarget: 44,
  headerHeight: 56,
  topBar: 56,
  bottomNav: 64,
  tabBarHeight: 64,
  inventorySlot: 72,
  inputHeight: 44,
  fabSize: 56,
  cardMinHeight: 120,
  modalMaxWidth: 400,
} as const;

export type Sizes = typeof sizes;
