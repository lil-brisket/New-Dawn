import type { ReactNode } from 'react';

export type IconSize = 'sm' | 'md' | 'lg';

export interface IconProps {
  name?: string;
  size?: IconSize;
  color?: string;
  children?: ReactNode;
  testID?: string;
}
