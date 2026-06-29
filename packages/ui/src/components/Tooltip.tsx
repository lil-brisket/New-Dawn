import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export interface TooltipProps {
  text: string;
  visible: boolean;
  testID?: string;
}

function TooltipComponent({ text, visible, testID }: TooltipProps) {
  const { colors, radius, spacing } = useTheme();

  if (!visible) return null;

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor: colors.backgroundElevated,
          borderRadius: radius.sm,
          padding: spacing.sm,
          borderColor: colors.border,
          borderWidth: 1,
        },
      ]}
    >
      <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { position: 'absolute', zIndex: 100 },
});

export const Tooltip = memo(TooltipComponent);
