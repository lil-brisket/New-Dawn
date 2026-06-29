import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';
import type { IconProps } from './Icon.types';

function IconComponent({ name, size = 'md', color, children, testID }: IconProps) {
  const { theme } = useTheme();
  const { icons, colors } = theme;
  const dim = icons[size];
  const tint = color ?? colors.text;

  if (children) {
    return (
      <View testID={testID} style={[styles.slot, { width: dim, height: dim }]}>
        {children}
      </View>
    );
  }

  return (
    <Text
      testID={testID}
      style={{ fontSize: dim * 0.85, color: tint, lineHeight: dim }}
      accessibilityElementsHidden
    >
      {name ? name.charAt(0).toUpperCase() : '•'}
    </Text>
  );
}

const styles = StyleSheet.create({
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const Icon = memo(IconComponent);
