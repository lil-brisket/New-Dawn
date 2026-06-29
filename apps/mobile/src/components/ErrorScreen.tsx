import { View, Text, StyleSheet } from 'react-native';
import { Button, useTheme } from '@dawn/ui';
import { ScreenBackground } from './ScreenBackground';

export interface ErrorScreenProps {
  onRetry?: () => void;
}

export function ErrorScreen({ onRetry }: ErrorScreenProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <ScreenBackground gradient>
      <View style={[styles.container, { padding: spacing.xl, gap: spacing.lg }]}>
        <Text
          style={{
            color: colors.error,
            fontSize: typography.fontSize['2xl'],
            fontWeight: typography.fontWeight.bold,
          }}
        >
          Something went wrong
        </Text>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: typography.fontSize.md,
            textAlign: 'center',
          }}
          maxFontSizeMultiplier={1.5}
        >
          An unexpected error occurred. Please try again.
        </Text>
        {onRetry ? (
          <Button title="Try Again" onPress={onRetry} accessibilityLabel="Try again" />
        ) : null}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
