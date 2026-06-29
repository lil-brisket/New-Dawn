import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export interface NotificationProps {
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  testID?: string;
}

function NotificationComponent({ message, variant = 'info', testID }: NotificationProps) {
  const { theme } = useTheme();
  const { colors, radius, spacing, border } = theme;

  const variantColor = {
    info: colors.info,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
  }[variant];

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor: colors.surface,
          borderLeftColor: variantColor,
          borderLeftWidth: border.thick,
          borderRadius: radius.md,
          padding: spacing.md,
        },
      ]}
    >
      <Text style={{ color: colors.text }}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {},
});

export const Notification = memo(NotificationComponent);
