import React, { memo, createContext, useContext, useEffect } from 'react';
import { Modal as RNModal, View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../../theme';
import { springs } from '../../../theme/motion/springs';
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
  const [open, setOpen] = useControllableState({
    value: visible,
    defaultValue: defaultVisible,
    onChange: onOpenChange,
  });

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);

  useEffect(() => {
    if (open) {
      opacity.value = withSpring(1, springs.modalOpen);
      scale.value = withSpring(1, springs.modalOpen);
    } else {
      opacity.value = withSpring(0, springs.modalOpen);
      scale.value = withSpring(0.92, springs.modalOpen);
    }
  }, [open, opacity, scale]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const dismiss = () => {
    if (dismissible) setOpen(false);
  };

  return (
    <ModalContext.Provider value={{ dismiss }}>
      <RNModal
        visible={open}
        transparent
        animationType="none"
        testID={testID}
        onRequestClose={dismiss}
      >
        <Animated.View style={[styles.overlay, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} accessibilityRole="button" />
          <Animated.View style={[styles.center, contentStyle]} pointerEvents="box-none">
            {children}
          </Animated.View>
        </Animated.View>
      </RNModal>
    </ModalContext.Provider>
  );
}

function ModalBackdrop({ children, onPress, testID }: ModalBackdropProps) {
  const { dismiss } = useContext(ModalContext);
  const { colors } = useTheme();

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
  const { components, radius, spacing } = useTheme();
  const tokens = components.modal.content;

  return (
    <GlassSurface
      testID={testID}
      style={[
        styles.content,
        {
          backgroundColor: tokens.bg,
          borderColor: tokens.border,
          borderWidth: tokens.borderWidth,
          borderRadius: radius.xl,
          padding: spacing.xl,
        },
        tokens.shadow,
      ]}
    >
      {children}
    </GlassSurface>
  );
}

function ModalHeader({ children, title, testID }: ModalHeaderProps) {
  const { colors, typography, spacing } = useTheme();

  return (
    <View testID={testID} style={{ marginBottom: spacing.md }}>
      {title ? (
        <Text
          style={{
            color: colors.textPrimary,
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
  const { colors, typography } = useTheme();

  return (
    <View testID={testID}>
      {typeof children === 'string' ? (
        <Text style={{ color: colors.textSecondary, fontSize: typography.fontSize.md }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

function ModalFooter({ children, testID }: ModalFooterProps) {
  const { spacing } = useTheme();

  return (
    <View testID={testID} style={[styles.footer, { marginTop: spacing.lg, gap: spacing.sm }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 11, 30, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  center: { width: '100%', maxWidth: 400 },
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
