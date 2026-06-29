import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  testID?: string;
}

function ProgressBarComponent({
  value,
  max,
  color,
  backgroundColor,
  height = 8,
  testID,
}: ProgressBarProps) {
  const { colors, radius } = useTheme();
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;

  return (
    <View
      testID={testID}
      style={[
        styles.track,
        {
          height,
          borderRadius: radius.full,
          backgroundColor: backgroundColor ?? colors.surfaceLight,
        },
      ]}
    >
      <View
        style={{
          width: `${pct * 100}%`,
          height: '100%',
          borderRadius: radius.full,
          backgroundColor: color ?? colors.primary,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden' },
});

export const ProgressBar = memo(ProgressBarComponent);

export function HealthBar(props: Omit<ProgressBarProps, 'color' | 'backgroundColor'>) {
  const { colors } = useTheme();
  return <ProgressBar {...props} color={colors.health} backgroundColor={colors.healthBg} />;
}

export function ManaBar(props: Omit<ProgressBarProps, 'color' | 'backgroundColor'>) {
  const { colors } = useTheme();
  return <ProgressBar {...props} color={colors.mana} backgroundColor={colors.manaBg} />;
}
