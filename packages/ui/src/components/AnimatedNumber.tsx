import React, { memo, useEffect, useState } from 'react';
import { Text, type TextProps } from 'react-native';
import { useTheme } from '../theme';

export interface AnimatedNumberProps extends TextProps {
  value: number;
  duration?: number;
  formatter?: (n: number) => string;
  testID?: string;
}

function AnimatedNumberComponent({
  value,
  duration = 500,
  formatter = (n) => String(Math.round(n)),
  style,
  testID,
  ...props
}: AnimatedNumberProps) {
  const { colors } = useTheme();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(1, elapsed / duration);
      setDisplay(start + diff * t);
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value, duration]);

  return (
    <Text testID={testID} style={[{ color: colors.text }, style]} {...props}>
      {formatter(display)}
    </Text>
  );
}

export const AnimatedNumber = memo(AnimatedNumberComponent);
