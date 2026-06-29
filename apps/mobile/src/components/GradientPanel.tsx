import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@dawn/ui';

export interface GradientPanelProps {
  children: ReactNode;
}

export function GradientPanel({ children }: GradientPanelProps) {
  const { theme } = useTheme();
  const { colors, radius, spacing, shadow, border } = theme;

  return (
    <LinearGradient
      colors={[colors.surface, colors.surfacePressed]}
      style={[
        styles.panel,
        {
          borderRadius: radius.lg,
          padding: spacing.lg,
          borderColor: colors.border,
          borderWidth: border.thin,
          ...shadow.md,
        },
      ]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  panel: {
    overflow: 'hidden',
  },
});
