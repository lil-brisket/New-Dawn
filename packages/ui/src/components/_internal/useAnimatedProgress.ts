import { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const progressSpring = { damping: 22, stiffness: 120, mass: 0.8 };

export function useAnimatedProgress(targetPct: number, animated: boolean) {
  const width = useSharedValue(targetPct);

  useEffect(() => {
    if (animated) {
      width.value = withSpring(targetPct, progressSpring);
    } else {
      width.value = targetPct;
    }
  }, [targetPct, animated, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return fillStyle;
}
