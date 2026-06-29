import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export interface TooltipProps {
  text: string;
  visible: boolean;
  testID?: string;
}

function TooltipComponent({ text, visible, testID }: TooltipProps) {
  const { theme } = useTheme();
  const { colors, radius, spacing, border, typography, zIndex } = theme;

  if (!visible) return null;

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor: colors.surfaceElevated,
          borderRadius: radius.sm,
          padding: spacing.sm,
          borderColor: colors.border,
          borderWidth: border.thin,
          zIndex: zIndex.tooltip,
        },
      ]}
    >
      <Text style={typography.textStyles.caption}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { position: 'absolute' },
});

export const Tooltip = memo(TooltipComponent);
