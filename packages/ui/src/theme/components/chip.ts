import { spacing } from '../tokens/spacing';
import { radius } from '../tokens/radius';
import { typography } from '../tokens/typography';

/** Shared chip/badge styling for CurrencyDisplay, BattleHeader, etc. */
export const chipTokens = {
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm - 2,
  borderRadius: radius.pill,
  fontSize: typography.fontSize.sm,
  fontWeight: typography.fontWeight.semibold,
} as const;

export type ChipTokens = typeof chipTokens;
