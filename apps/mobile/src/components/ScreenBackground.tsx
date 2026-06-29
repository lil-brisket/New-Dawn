import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@dawn/ui';

export interface ScreenBackgroundProps {
  children: ReactNode;
  gradient?: boolean;
}

export function ScreenBackground({ children, gradient = false }: ScreenBackgroundProps) {
  const { theme } = useTheme();
  const { colors } = theme;

  if (gradient) {
    return (
      <LinearGradient
        colors={[colors.gradientStart, colors.background, colors.gradientEnd]}
        style={styles.fill}
      >
        {children}
      </LinearGradient>
    );
  }

  return <View style={[styles.fill, { backgroundColor: colors.background }]}>{children}</View>;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
