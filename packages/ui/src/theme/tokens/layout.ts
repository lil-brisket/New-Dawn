import { spacing } from './spacing';
import { sizes } from './sizes';

/** Screen-level layout constants */
export const layout = {
  maxContentWidth: sizes.modalMaxWidth,
  screenPadding: spacing.lg,
  sectionGap: spacing.xl,
  cardGap: spacing.md,
  listGap: spacing.sm,
  headerHeight: sizes.headerHeight,
  bottomInsetPadding: spacing.lg,
  /** @deprecated Remove after Phase 7 — use screenPadding */
  topOffset: 0,
  /** @deprecated Remove after Phase 7 — use bottomInsetPadding */
  bottomOffset: 0,
  /** @deprecated Remove after Phase 7 — use screenPadding */
  horizontalPadding: spacing.lg,
} as const;

export type Layout = typeof layout;
