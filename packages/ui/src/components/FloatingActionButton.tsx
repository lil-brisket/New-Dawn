import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export interface FloatingActionButtonProps {
  icon?: string;
  label?: string;
  onPress?: () => void;
  testID?: string;
}

function FloatingActionButtonComponent({
  label = '+',
  onPress,
  testID,
}: FloatingActionButtonProps) {
  const { theme } = useTheme();
  const { colors, radius, shadow, sizes, layout, typography } = theme;

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      style={[
        styles.base,
        {
          backgroundColor: colors.gold,
          borderRadius: radius.pill,
          width: sizes.fabSize,
          height: sizes.fabSize,
          bottom: layout.screenPadding,
          right: layout.screenPadding,
        },
        shadow.lg,
      ]}
    >
      <Text
        style={[
          typography.textStyles.heading,
          { color: colors.textInverse, fontSize: typography.fontSize.xl },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
});

export const FloatingActionButton = memo(FloatingActionButtonComponent);
