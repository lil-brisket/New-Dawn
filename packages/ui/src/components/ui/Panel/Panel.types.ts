import type { ReactNode } from 'react';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

export type PanelVariant = 'default' | 'elevated' | 'outlined';
export type PanelBorderStyle = 'default' | 'ornate';

export interface PanelProps extends ViewProps {
  variant?: PanelVariant;
  borderStyle?: PanelBorderStyle;
  children?: ReactNode;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export interface PanelHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children?: ReactNode;
  testID?: string;
}

export interface PanelBodyProps {
  children?: ReactNode;
  testID?: string;
}

export interface PanelFooterProps {
  children?: ReactNode;
  testID?: string;
}
