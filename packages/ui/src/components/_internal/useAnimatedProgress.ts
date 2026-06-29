import { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { springs } from '../../theme/motion/springs';

export function useAnimatedProgress(targetPct: number, animated: boolean) {
  const width = useSharedValue(targetPct);

  useEffect(() => {
    if (animated) {
      width.value = withSpring(targetPct, springs.progressFill);
    } else {
      width.value = targetPct;
    }
  }, [targetPct, animated, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return fillStyle;
}
