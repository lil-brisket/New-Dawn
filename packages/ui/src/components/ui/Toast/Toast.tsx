import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';
import { ToastMessage } from './ToastMessage';
import type {
  ToastContextValue,
  ToastItem,
  ToastOptions,
  ToastProviderProps,
  ToastVariant,
  ToastViewportProps,
} from './Toast.types';

const DEFAULT_DURATION = 3000;

const ToastContext = createContext<ToastContextValue | null>(null);

let toastRef: ToastContextValue | null = null;

/** Imperative toast API for use outside React components */
export const toast = {
  success: (message: string, options?: ToastOptions) => toastRef?.success(message, options),
  warning: (message: string, options?: ToastOptions) => toastRef?.warning(message, options),
  error: (message: string, options?: ToastOptions) => toastRef?.error(message, options),
  info: (message: string, options?: ToastOptions) => toastRef?.info(message, options),
  dismiss: (id: string) => toastRef?.dismiss(id),
};

export function ToastProvider({
  children,
  defaultDuration = DEFAULT_DURATION,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, variant: ToastVariant, options?: ToastOptions) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [
        ...prev,
        { id, message, variant, duration: options?.duration ?? defaultDuration },
      ]);
    },
    [defaultDuration],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (message, options) => show(message, 'success', options),
      warning: (message, options) => show(message, 'warning', options),
      error: (message, options) => show(message, 'error', options),
      info: (message, options) => show(message, 'info', options),
      dismiss,
    }),
    [show, dismiss],
  );

  useEffect(() => {
    toastRef = value;
    return () => {
      toastRef = null;
    };
  }, [value]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewportInternal toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewportInternal({
  toasts,
  onDismiss,
  testID,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  testID?: string;
}) {
  const { spacing } = useTheme();

  if (toasts.length === 0) return null;

  return (
    <View
      testID={testID}
      style={[styles.viewport, { top: spacing['3xl'], left: spacing.xl, right: spacing.xl }]}
      pointerEvents="box-none"
    >
      {toasts.map((item) => (
        <ToastMessage key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </View>
  );
}

export function ToastViewport(_props: ToastViewportProps) {
  return null;
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

/** @deprecated Use useToast() instead */
export function Toast({ message, visible }: { message: string; visible: boolean }) {
  if (!visible) return null;
  return (
    <ToastMessage
      item={{ id: 'legacy', message, variant: 'info', duration: 3000 }}
      onDismiss={() => {}}
    />
  );
}

const styles = StyleSheet.create({
  viewport: {
    position: 'absolute',
    zIndex: 9999,
  },
});
