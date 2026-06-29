import { View, Text, StyleSheet } from 'react-native';
import { Button, useTheme } from '@dawn/ui';
import { router } from 'expo-router';
import { ROUTES } from '@/navigation/routes';
import { ScreenBackground } from './ScreenBackground';

export function NotFound() {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <ScreenBackground>
      <View style={[styles.container, { padding: spacing.xl, gap: spacing.lg }]}>
        <Text
          style={{
            color: colors.accent,
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
          }}
        >
          404
        </Text>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: typography.fontSize.md,
            textAlign: 'center',
          }}
          maxFontSizeMultiplier={1.5}
        >
          This realm has not been discovered yet.
        </Text>
        <Button
          title="Return Home"
          onPress={() => router.replace(ROUTES.HOME)}
          accessibilityLabel="Return to home screen"
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
