import type { ReactNode } from 'react';
import type { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';

export interface WindowProps {
  children?: ReactNode;
  title?: string;
  icon?: ReactNode;
  scrollable?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export interface WindowHeaderProps {
  title?: string;
  icon?: ReactNode;
  children?: ReactNode;
  testID?: string;
}

export interface WindowBodyProps extends ScrollViewProps {
  children?: ReactNode;
  scrollable?: boolean;
  testID?: string;
}

export interface WindowFooterProps {
  children?: ReactNode;
  testID?: string;
}
