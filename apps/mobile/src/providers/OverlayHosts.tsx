import { useEffect } from 'react';
import { LoadingOverlay, Toast } from '@dawn/ui';
import { useUIStore } from '@/stores/uiStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { AppConstants } from '@/constants/AppConstants';

export function LoadingOverlayHost() {
  const isLoading = useUIStore((s) => s.isLoading);
  return <LoadingOverlay visible={isLoading} />;
}

export function ToastHost() {
  const toastVisible = useNotificationStore((s) => s.toastVisible);
  const toastMessage = useNotificationStore((s) => s.toastMessage);
  const hideToast = useNotificationStore((s) => s.hideToast);

  useEffect(() => {
    if (!toastVisible) return;
    const timer = setTimeout(hideToast, AppConstants.TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toastVisible, hideToast]);

  return <Toast visible={toastVisible} message={toastMessage ?? ''} />;
}
