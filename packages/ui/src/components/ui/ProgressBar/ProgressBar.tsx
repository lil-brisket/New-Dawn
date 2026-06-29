import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useTheme } from '../../../theme';
import { useAnimatedProgress } from '../../_internal/useAnimatedProgress';
import type { ProgressBarProps } from './ProgressBar.types';

function ProgressBarComponent({
  value,
  max,
  animated = false,
  color,
  backgroundColor,
  height,
  label,
  testID,
  accessibilityLabel,
}: ProgressBarProps) {
  const { theme } = useTheme();
  const { colors, radius, sizes, typography, spacing } = theme;
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const barHeight = height ?? sizes.progressBar.md;
  const fillStyle = useAnimatedProgress(pct, animated);
  const trackColor = backgroundColor ?? colors.surfacePressed;
  const fillColor = color ?? colors.primary;

  return (
    <View testID={testID} accessibilityLabel={accessibilityLabel ?? label}>
      {label ? (
        <Text
          style={{
            color: colors.textMuted,
            fontSize: typography.fontSize.sm,
            marginBottom: spacing.xs,
          }}
        >
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.track,
          {
            height: barHeight,
            borderRadius: radius.pill,
            backgroundColor: trackColor,
          },
        ]}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max, now: value }}
      >
        {animated ? (
          <Animated.View
            style={[
              styles.fill,
              { backgroundColor: fillColor, borderRadius: radius.pill },
              fillStyle,
            ]}
          />
        ) : (
          <View
            style={[
              styles.fill,
              {
                width: `${pct}%`,
                backgroundColor: fillColor,
                borderRadius: radius.pill,
              },
            ]}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden' },
  fill: { height: '100%' },
});

export const ProgressBar = memo(ProgressBarComponent);
export type { ProgressBarProps };
