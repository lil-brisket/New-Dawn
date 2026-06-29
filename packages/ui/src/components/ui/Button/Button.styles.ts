import type { ButtonSize } from './Button.types';
import type { ColorPalette } from '../../../theme/tokens/colors';
import { createButtonVariants } from '../../../theme/components/button';
import { spacing } from '../../../theme/tokens/spacing';

export function getButtonVariants(colors: ColorPalette) {
  return createButtonVariants(colors);
}

export const buttonSizeStyles: Record<
  ButtonSize,
  { fontSize: 'xs' | 'sm' | 'md'; paddingH: number }
> = {
  xs: { fontSize: 'xs', paddingH: spacing.md },
  sm: { fontSize: 'sm', paddingH: spacing.lg },
  md: { fontSize: 'md', paddingH: spacing.xl - 4 },
  lg: { fontSize: 'md', paddingH: spacing.xl },
};
