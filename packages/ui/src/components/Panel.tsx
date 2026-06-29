import React, { memo } from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { useTheme } from '../theme';

export interface PanelProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
  testID?: string;
}

function PanelComponent({ children, variant = 'default', style, testID, ...props }: PanelProps) {
  const { colors, radius, spacing, shadows } = useTheme();

  const bg =
    variant === 'elevated'
      ? colors.surfaceLight
      : variant === 'outlined'
        ? 'transparent'
        : colors.surface;

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          borderRadius: radius.lg,
          padding: spacing.lg,
          borderWidth: variant === 'outlined' ? 1 : 0,
          borderColor: colors.border,
        },
        variant === 'elevated' ? shadows.md : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
});

export const Panel = memo(PanelComponent);
