import React, { memo } from 'react';
import { Modal as RNModal, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../theme';

export interface ModalProps {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  testID?: string;
}

function ModalComponent({ visible, onClose, children, testID }: ModalProps) {
  const { colors, radius } = useTheme();

  return (
    <RNModal visible={visible} transparent animationType="slide" testID={testID}>
      <Pressable style={[styles.overlay, { backgroundColor: colors.overlay }]} onPress={onClose}>
        <Pressable
          style={[
            styles.content,
            { backgroundColor: colors.backgroundElevated, borderRadius: radius.xl },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  content: { padding: 24, minHeight: 200 },
});

export const Modal = memo(ModalComponent);
