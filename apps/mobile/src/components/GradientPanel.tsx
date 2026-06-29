import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@dawn/ui';

export interface GradientPanelProps {
  children: ReactNode;
}

export function GradientPanel({ children }: GradientPanelProps) {
  const { colors, radius, spacing, shadows } = useTheme();

  return (
    <LinearGradient
      colors={[colors.surface, colors.surfaceLight]}
      style={[
        styles.panel,
        {
          borderRadius: radius.lg,
          padding: spacing.lg,
          borderColor: colors.border,
          ...shadows.md,
        },
      ]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});
