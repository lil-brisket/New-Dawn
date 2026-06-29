import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import { GradientPanel } from './GradientPanel';

export function OfflinePlaceholder() {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <View style={[styles.container, { padding: spacing.xl }]}>
      <GradientPanel>
        <Text
          style={{
            color: colors.text,
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
            textAlign: 'center',
          }}
          maxFontSizeMultiplier={1.5}
        >
          You are offline
        </Text>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: typography.fontSize.sm,
            textAlign: 'center',
            marginTop: spacing.sm,
          }}
          maxFontSizeMultiplier={1.5}
        >
          Check your connection and try again.
        </Text>
      </GradientPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
});
