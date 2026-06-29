import React, { memo } from 'react';
import { Modal as RNModal, View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../theme';
import { Button } from './Button';

export interface DialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  testID?: string;
}

function DialogComponent({
  visible,
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  testID,
}: DialogProps) {
  const { colors, radius, spacing } = useTheme();

  return (
    <RNModal visible={visible} transparent animationType="fade" testID={testID}>
      <Pressable style={[styles.overlay, { backgroundColor: colors.overlay }]} onPress={onCancel}>
        <Pressable
          style={[
            styles.content,
            { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl },
          ]}
        >
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>{title}</Text>
          {message ? (
            <Text style={{ color: colors.textSecondary, marginTop: spacing.sm }}>{message}</Text>
          ) : null}
          <View style={styles.actions}>
            {onCancel ? (
              <Button title={cancelLabel} variant="ghost" onPress={onCancel} style={{ flex: 1 }} />
            ) : null}
            {onConfirm ? (
              <Button title={confirmLabel} onPress={onConfirm} style={{ flex: 1 }} />
            ) : null}
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  content: { width: '100%', maxWidth: 340 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
});

export const Dialog = memo(DialogComponent);
