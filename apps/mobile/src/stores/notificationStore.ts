import { create } from 'zustand';

export interface AppNotification {
  id: string;
  message: string;
  variant: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationState {
  notifications: AppNotification[];
  toastMessage: string | null;
  toastVisible: boolean;
  add: (notification: Omit<AppNotification, 'id'>) => void;
  remove: (id: string) => void;
  showToast: (message: string) => void;
  hideToast: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  toastMessage: null,
  toastVisible: false,
  add: (notification) =>
    set((s) => ({
      notifications: [...s.notifications, { ...notification, id: `notif_${Date.now()}` }],
    })),
  remove: (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
  showToast: (message) => set({ toastMessage: message, toastVisible: true }),
  hideToast: () => set({ toastVisible: false, toastMessage: null }),
}));
