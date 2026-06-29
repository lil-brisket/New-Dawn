import type { ReactNode } from 'react';
import type { ImageSourcePropType } from 'react-native';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface AvatarProps {
  image?: ImageSourcePropType | string;
  initials?: string;
  /** @deprecated Use initials */
  label?: string;
  size?: AvatarSize;
  rarity?: AvatarRarity;
  online?: boolean;
  statusBadge?: ReactNode;
  testID?: string;
  accessibilityLabel?: string;
}
