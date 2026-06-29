import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export interface ToastProps {
  message: string;
  visible: boolean;
  testID?: string;
}

function ToastComponent({ message, visible, testID }: ToastProps) {
  const { colors, radius, spacing } = useTheme();

  if (!visible) return null;

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor: colors.surfaceLight,
          borderRadius: radius.md,
          padding: spacing.md,
        },
      ]}
    >
      <Text style={{ color: colors.text, textAlign: 'center' }}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    right: 24,
    alignSelf: 'center',
  },
});

export const Toast = memo(ToastComponent);
