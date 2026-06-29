import React, { memo } from 'react';
import { ProgressBar } from '../ui/ProgressBar';
import { useTheme } from '../../theme';
import type { ProgressBarProps } from '../ui/ProgressBar';

export const HealthBar = memo(function HealthBar(
  props: Omit<ProgressBarProps, 'color' | 'backgroundColor'>,
) {
  const { theme } = useTheme();
  const { colors } = theme;
  return <ProgressBar {...props} color={colors.health} backgroundColor={colors.healthBg} />;
});

export const ManaBar = memo(function ManaBar(
  props: Omit<ProgressBarProps, 'color' | 'backgroundColor'>,
) {
  const { theme } = useTheme();
  const { colors } = theme;
  return <ProgressBar {...props} color={colors.mana} backgroundColor={colors.manaBg} />;
});
