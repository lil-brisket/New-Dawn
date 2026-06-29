import type { ButtonVariant, ButtonSize } from './Button.types';
import type { ButtonTokens } from '../../../theme/components';
import { componentTokens } from '../../../theme/components';

export const buttonVariants: Record<ButtonVariant, ButtonTokens> = componentTokens.button;

export const buttonSizeStyles: Record<
  ButtonSize,
  { fontSize: 'xs' | 'sm' | 'md'; paddingH: number }
> = {
  xs: { fontSize: 'xs', paddingH: 12 },
  sm: { fontSize: 'sm', paddingH: 16 },
  md: { fontSize: 'md', paddingH: 20 },
  lg: { fontSize: 'md', paddingH: 24 },
};
