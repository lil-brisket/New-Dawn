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
  const { colors, radius, shadows } = useTheme();

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      style={[
        styles.base,
        {
          backgroundColor: colors.accent,
          borderRadius: radius.full,
        },
        shadows.lg,
      ]}
    >
      <Text style={{ color: colors.background, fontSize: 24, fontWeight: '700' }}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
});

export const FloatingActionButton = memo(FloatingActionButtonComponent);
