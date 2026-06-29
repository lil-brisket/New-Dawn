import React, { memo, useEffect, useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../../../theme';
import { createToastTokens } from '../../../theme/components/toast';
import type { ToastMessageProps } from './Toast.types';

function ToastMessageComponent({ item, onDismiss, testID }: ToastMessageProps) {
  const { theme } = useTheme();
  const { colors, radius, spacing, typography, shadow } = theme;
  const toastTokens = useMemo(() => createToastTokens(colors), [colors]);
  const tokens = toastTokens[item.variant];
  const spring = theme.animation.spring.gentle;
  const translateY = useSharedValue(-20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, spring);
    opacity.value = withSpring(1, spring);

    const timer = setTimeout(() => {
      opacity.value = withSpring(0, spring, (finished) => {
        if (finished) runOnJS(onDismiss)(item.id);
      });
      translateY.value = withSpring(-10, spring);
    }, item.duration);

    return () => clearTimeout(timer);
  }, [item.id, item.duration, onDismiss, opacity, translateY, spring]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      testID={testID}
      style={[
        styles.base,
        shadow.md,
        animatedStyle,
        {
          backgroundColor: tokens.bg,
          borderLeftColor: tokens.accent,
          borderLeftWidth: tokens.accentBorderWidth,
          borderRadius: radius.md,
          padding: spacing.md,
          marginBottom: spacing.sm,
        },
      ]}
      accessibilityRole="alert"
    >
      <Text style={{ color: tokens.text, fontSize: typography.fontSize.md }}>{item.message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {},
});

export const ToastMessage = memo(ToastMessageComponent);
