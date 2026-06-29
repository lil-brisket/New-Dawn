import React, { memo, createContext, useContext, useEffect } from 'react';
import { Modal as RNModal, View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../../theme';
import { useControllableState } from '../../_internal/useControllableState';
import { GlassSurface } from '../../_internal/GlassSurface';
import type {
  ModalProps,
  ModalBackdropProps,
  ModalContentProps,
  ModalHeaderProps,
  ModalFooterProps,
  ModalBodyProps,
} from './Modal.types';

interface ModalContextValue {
  dismiss: () => void;
}

const ModalContext = createContext<ModalContextValue>({ dismiss: () => {} });

function ModalRoot({
  children,
  visible,
  defaultVisible = false,
  onOpenChange,
  dismissible = true,
  testID,
}: ModalProps) {
  const { theme } = useTheme();
  const spring = theme.animation.spring.gentle;
  const [open, setOpen] = useControllableState({
    value: visible,
    defaultValue: defaultVisible,
    onChange: onOpenChange,
  });

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);

  useEffect(() => {
    if (open) {
      opacity.value = withSpring(1, spring);
      scale.value = withSpring(1, spring);
    } else {
      opacity.value = withSpring(0, spring);
      scale.value = withSpring(0.92, spring);
    }
  }, [open, opacity, scale, spring]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const dismiss = () => {
    if (dismissible) setOpen(false);
  };

  const { colors, layout } = theme;

  return (
    <ModalContext.Provider value={{ dismiss }}>
      <RNModal
        visible={open}
        transparent
        animationType="none"
        testID={testID}
        onRequestClose={dismiss}
      >
        <Animated.View
          style={[
            styles.overlay,
            { backgroundColor: colors.backdrop, padding: layout.screenPadding },
            backdropStyle,
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} accessibilityRole="button" />
          <Animated.View
            style={[styles.center, { maxWidth: layout.maxContentWidth }, contentStyle]}
            pointerEvents="box-none"
          >
            {children}
          </Animated.View>
        </Animated.View>
      </RNModal>
    </ModalContext.Provider>
  );
}

function ModalBackdrop({ children, onPress, testID }: ModalBackdropProps) {
  const { dismiss } = useContext(ModalContext);
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <Pressable
      testID={testID}
      style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]}
      onPress={onPress ?? dismiss}
    >
      {children}
    </Pressable>
  );
}

function ModalContent({ children, testID }: ModalContentProps) {
  const { theme } = useTheme();
  const { colors, radius, spacing, shadow, border } = theme;

  return (
    <GlassSurface
      testID={testID}
      style={[
        styles.content,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
          borderWidth: border.thin,
          borderRadius: radius.xl,
          padding: spacing.xl,
        },
        shadow.lg,
      ]}
    >
      {children}
    </GlassSurface>
  );
}

function ModalHeader({ children, title, testID }: ModalHeaderProps) {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;

  return (
    <View testID={testID} style={{ marginBottom: spacing.md }}>
      {title ? (
        <Text
          style={{
            color: colors.text,
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
          }}
        >
          {title}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

function ModalBody({ children, testID }: ModalBodyProps) {
  const { theme } = useTheme();
  const { colors, typography } = theme;

  return (
    <View testID={testID}>
      {typeof children === 'string' ? (
        <Text style={{ color: colors.textMuted, fontSize: typography.fontSize.md }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

function ModalFooter({ children, testID }: ModalFooterProps) {
  const { theme } = useTheme();
  const { spacing } = theme;

  return (
    <View testID={testID} style={[styles.footer, { marginTop: spacing.lg, gap: spacing.sm }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: { width: '100%' },
  content: { width: '100%' },
  footer: { flexDirection: 'row', justifyContent: 'flex-end' },
});

export const Modal = Object.assign(memo(ModalRoot), {
  Backdrop: memo(ModalBackdrop),
  Content: memo(ModalContent),
  Header: memo(ModalHeader),
  Body: memo(ModalBody),
  Footer: memo(ModalFooter),
});

export type { ModalProps, ModalHeaderProps, ModalFooterProps, ModalBodyProps };
