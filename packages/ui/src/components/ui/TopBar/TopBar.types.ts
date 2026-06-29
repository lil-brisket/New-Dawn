import type { ReactNode } from 'react';

export interface TopBarProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  leftAction?: ReactNode;
  rightActions?: ReactNode[];
  onBack?: () => void;
  rightAction?: ReactNode;
  testID?: string;
}
