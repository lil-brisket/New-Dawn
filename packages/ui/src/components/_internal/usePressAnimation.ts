import { useCallback } from 'react';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { animation } from '../../theme/tokens/animation';

export function usePressAnimation(pressedScale = 0.96) {
  const scale = useSharedValue(1);
  const spring = animation.spring.snappy;

  const onPressIn = useCallback(() => {
    scale.value = withSpring(pressedScale, spring);
  }, [pressedScale, scale, spring]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, spring);
  }, [scale, spring]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, onPressIn, onPressOut, scale };
}
