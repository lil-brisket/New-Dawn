import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '@dawn/ui';
import { ScreenLayout } from '@/layouts/ScreenLayout';

export function SplashScreen() {
  const { theme } = useTheme();
  const { colors, spacing, typography, animation } = theme;
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: animation.duration.normal });
  }, [opacity, animation.duration.normal]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <ScreenLayout gradient>
      <View style={styles.container}>
        <Animated.View style={[styles.logoBlock, animatedStyle]}>
          <Text
            style={{
              color: colors.gold,
              fontSize: typography.fontSize['3xl'],
              fontWeight: typography.fontWeight.bold,
              letterSpacing: typography.letterSpacing.brand,
            }}
            accessibilityRole="header"
          >
            DAWN
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: typography.fontSize.md,
              marginTop: spacing.sm,
            }}
            maxFontSizeMultiplier={1.5}
          >
            Tactical Fantasy RPG
          </Text>
        </Animated.View>
        <ActivityIndicator
          size="large"
          color={colors.gold}
          style={{ marginTop: spacing['3xl'] }}
          accessibilityLabel="Loading application"
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoBlock: { alignItems: 'center' },
});
