import React, { memo, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { usePressAnimation } from './usePressAnimation';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  testID?: string;
}

function PressableScaleComponent({
  children,
  style,
  disabled,
  onPressIn,
  onPressOut,
  testID,
  ...props
}: PressableScaleProps) {
  const { theme } = useTheme();
  const { sizes } = theme;
  const {
    animatedStyle,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
  } = usePressAnimation();

  return (
    <AnimatedPressable
      testID={testID}
      disabled={disabled}
      style={[
        styles.base,
        { minHeight: sizes.touchTarget, minWidth: sizes.touchTarget },
        animatedStyle,
        style,
      ]}
      onPressIn={(e) => {
        handlePressIn();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        handlePressOut();
        onPressOut?.(e);
      }}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const PressableScale = memo(PressableScaleComponent);
