import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import { AppIcon } from './AppIcon';

export interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <View style={[styles.container, { padding: spacing.xl, gap: spacing.md }]}>
      <AppIcon name="inventory" size="xl" color={colors.textMuted} accessibilityLabel={title} />
      <Text
        style={{
          color: colors.text,
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.bold,
          textAlign: 'center',
        }}
        maxFontSizeMultiplier={1.5}
      >
        {title}
      </Text>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: typography.fontSize.sm,
          textAlign: 'center',
        }}
        maxFontSizeMultiplier={1.5}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
});
