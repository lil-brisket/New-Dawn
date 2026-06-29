import type { ReactNode } from 'react';

export interface ModalProps {
  children?: ReactNode;
  visible?: boolean;
  defaultVisible?: boolean;
  onOpenChange?: (open: boolean) => void;
  dismissible?: boolean;
  testID?: string;
}

export interface ModalBackdropProps {
  children?: ReactNode;
  onPress?: () => void;
  testID?: string;
}

export interface ModalContentProps {
  children?: ReactNode;
  testID?: string;
}

export interface ModalHeaderProps {
  children?: ReactNode;
  title?: string;
  testID?: string;
}

export interface ModalFooterProps {
  children?: ReactNode;
  testID?: string;
}

export interface ModalBodyProps {
  children?: ReactNode;
  testID?: string;
}
