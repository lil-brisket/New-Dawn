import { useCallback } from 'react';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { springs } from '../../theme/motion/springs';

export function usePressAnimation(pressedScale = 0.96) {
  const scale = useSharedValue(1);

  const onPressIn = useCallback(() => {
    scale.value = withSpring(pressedScale, springs.buttonPress);
  }, [pressedScale, scale]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, springs.buttonPress);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, onPressIn, onPressOut, scale };
}
