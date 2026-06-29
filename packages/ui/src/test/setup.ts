import { vi } from 'vitest';
import React from 'react';

vi.mock('react-native-reanimated', () => {
  const Animated = {
    View: React.forwardRef((props: Record<string, unknown>, ref: unknown) =>
      React.createElement('div', { ...props, ref }),
    ),
    createAnimatedComponent: (Comp: React.ComponentType) => Comp,
  };
  return {
    __esModule: true,
    default: Animated,
    useSharedValue: (init: number) => ({ value: init }),
    useAnimatedStyle: (fn: () => Record<string, unknown>) => fn(),
    withSpring: (to: number) => to,
    withTiming: (to: number) => to,
    runOnJS: (fn: () => void) => fn,
  };
});

vi.mock('react-native', () => {
  const createElement = (
    tag: string,
    {
      onPress,
      accessibilityRole,
      accessibilityLabel,
      accessibilityState,
      ...props
    }: Record<string, unknown>,
    children: React.ReactNode,
  ) => {
    const isButton =
      accessibilityRole === 'button' || tag === 'Pressable' || tag === 'TouchableOpacity';
    return React.createElement(
      isButton ? 'button' : 'div',
      {
        ...props,
        role: accessibilityRole ?? props.role,
        'aria-label': accessibilityLabel,
        'aria-disabled': (accessibilityState as { disabled?: boolean })?.disabled,
        onClick: onPress,
      },
      children,
    );
  };

  const createComponent = (name: string) => {
    const Comp = ({ children, ...props }: Record<string, unknown>) =>
      createElement(name, props, children as React.ReactNode);
    Comp.displayName = name;
    return Comp;
  };

  return {
    View: createComponent('View'),
    Text: ({ children, onPress, ...props }: Record<string, unknown>) =>
      React.createElement(onPress ? 'button' : 'span', { onClick: onPress, ...props }, children),
    Pressable: createComponent('Pressable'),
    TouchableOpacity: createComponent('TouchableOpacity'),
    ScrollView: createComponent('ScrollView'),
    Image: createComponent('Image'),
    ActivityIndicator: createComponent('ActivityIndicator'),
    Modal: ({ children, visible }: { children?: React.ReactNode; visible?: boolean }) =>
      visible ? React.createElement('div', { role: 'dialog' }, children) : null,
    Switch: createComponent('Switch'),
    StyleSheet: {
      create: <T extends Record<string, unknown>>(styles: T) => styles,
      absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
      absoluteFillObject: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
      flatten: (style: unknown) => style,
    },
    Platform: { OS: 'ios', select: (obj: Record<string, unknown>) => obj.ios ?? obj.default },
    useColorScheme: () => 'dark',
  };
});
