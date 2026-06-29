import React, { memo, useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../theme';
import { Modal } from '../Modal';
import { Button } from '../Button';
import type { DialogProps } from './Dialog.types';

function DialogComponent({
  visible,
  defaultVisible,
  onOpenChange,
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  testID,
  dismissible = true,
}: DialogProps) {
  const { theme } = useTheme();
  const { spacing } = theme;
  const [open, setOpen] = useState(defaultVisible ?? false);
  const isControlled = visible !== undefined;
  const isOpen = isControlled ? visible : open;

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setOpen(next);
    onOpenChange?.(next);
    if (!next) onCancel?.();
  };

  return (
    <Modal
      visible={isOpen}
      onOpenChange={handleOpenChange}
      dismissible={dismissible}
      testID={testID}
    >
      <Modal.Content>
        <Modal.Header title={title} />
        {message ? <Modal.Body>{message}</Modal.Body> : null}
        <Modal.Footer>
          <View style={{ flexDirection: 'row', gap: spacing.md, flex: 1 }}>
            {onCancel ? (
              <Button
                title={cancelLabel}
                variant="ghost"
                onPress={() => handleOpenChange(false)}
                style={{ flex: 1 }}
              />
            ) : null}
            {onConfirm ? (
              <Button title={confirmLabel} onPress={onConfirm} style={{ flex: 1 }} />
            ) : null}
          </View>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

export const Dialog = memo(DialogComponent);
