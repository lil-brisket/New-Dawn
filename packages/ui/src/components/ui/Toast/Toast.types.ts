import type { ReactNode } from 'react';

export type ToastVariant = 'success' | 'warning' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

export interface ToastOptions {
  duration?: number;
}

export interface ToastContextValue {
  success: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  dismiss: (id: string) => void;
}

export interface ToastProviderProps {
  children: ReactNode;
  defaultDuration?: number;
}

export interface ToastViewportProps {
  testID?: string;
}

export interface ToastMessageProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
  testID?: string;
}
