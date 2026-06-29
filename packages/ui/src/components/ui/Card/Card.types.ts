import type { ReactNode } from 'react';
import type { ImageSourcePropType, StyleProp, ViewProps, ViewStyle } from 'react-native';

export type CardVariant = 'default' | 'elevated' | 'outlined';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  /** Convenience prop — renders Card.Header */
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export interface CardHeaderProps {
  children?: ReactNode;
  icon?: ReactNode;
  testID?: string;
}

export interface CardBodyProps {
  children?: ReactNode;
  image?: ImageSourcePropType;
  testID?: string;
}

export interface CardFooterProps {
  children?: ReactNode;
  testID?: string;
}
