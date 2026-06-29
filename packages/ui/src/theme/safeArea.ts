export const safeArea = {
  topOffset: 0,
  bottomOffset: 0,
  horizontalPadding: 16,
} as const;

export type SafeArea = typeof safeArea;
