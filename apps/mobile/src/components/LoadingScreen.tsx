import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import { ScreenBackground } from './ScreenBackground';

export interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  const { colors, spacing, typography } = useTheme();

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.accent} accessibilityLabel="Loading" />
        <Text
          style={{
            color: colors.textSecondary,
            marginTop: spacing.md,
            fontSize: typography.fontSize.md,
          }}
          maxFontSizeMultiplier={1.5}
        >
          {message}
        </Text>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
