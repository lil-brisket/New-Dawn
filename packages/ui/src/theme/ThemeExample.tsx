import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from './ThemeProvider';

/**
 * Reference component demonstrating primitive token composition.
 * Components derive styles from theme tokens — no magic numbers.
 */
export function ThemeExample() {
  const { theme } = useTheme();
  const { colors, spacing, typography, radius, shadow, border, opacity, game } = theme;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceElevated,
          borderRadius: radius.lg,
          padding: spacing.lg,
          borderColor: colors.border,
          borderWidth: border.thin,
          gap: spacing.md,
        },
        shadow.md,
      ]}
    >
      <Text style={typography.textStyles.heading}>Theme Example</Text>
      <Text style={[typography.textStyles.body, { color: colors.textMuted }]}>
        Composed from colors, spacing, typography, border, and shadow tokens.
      </Text>
      <View
        style={{
          height: game.battle.healthBarHeight,
          backgroundColor: colors.health,
          borderRadius: radius.pill,
          opacity: opacity.pressed,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {},
});
