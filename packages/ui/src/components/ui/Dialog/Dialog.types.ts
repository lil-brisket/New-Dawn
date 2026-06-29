export interface DialogProps {
  visible?: boolean;
  defaultVisible?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  dismissible?: boolean;
  testID?: string;
}
