import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export interface NotificationProps {
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  testID?: string;
}

function NotificationComponent({ message, variant = 'info', testID }: NotificationProps) {
  const { colors, radius, spacing } = useTheme();

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
  base: { borderLeftWidth: 4 },
});

export const Notification = memo(NotificationComponent);
