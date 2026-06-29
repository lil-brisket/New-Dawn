import React, { memo, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../../../theme';
import { springs } from '../../../theme/motion/springs';
import type { ToastMessageProps } from './Toast.types';

function ToastMessageComponent({ item, onDismiss, testID }: ToastMessageProps) {
  const { components, radius, spacing, typography } = useTheme();
  const tokens = components.toast[item.variant];
  const translateY = useSharedValue(-20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, springs.toastEnter);
    opacity.value = withSpring(1, springs.toastEnter);

    const timer = setTimeout(() => {
      opacity.value = withSpring(0, springs.toastEnter, (finished) => {
        if (finished) runOnJS(onDismiss)(item.id);
      });
      translateY.value = withSpring(-10, springs.toastEnter);
    }, item.duration);

    return () => clearTimeout(timer);
  }, [item.id, item.duration, onDismiss, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      testID={testID}
      style={[
        styles.base,
        animatedStyle,
        {
          backgroundColor: tokens.bg,
          borderLeftColor: tokens.accent,
          borderRadius: radius.md,
          padding: spacing.md,
        },
      ]}
      accessibilityRole="alert"
    >
      <Text style={{ color: tokens.text, fontSize: typography.fontSize.md }}>{item.message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderLeftWidth: 4,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});

export const ToastMessage = memo(ToastMessageComponent);
