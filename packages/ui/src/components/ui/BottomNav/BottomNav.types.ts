import type { ReactNode } from 'react';

export interface BottomNavItem {
  icon: ReactNode;
  label: string;
  active: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  testID?: string;
}
