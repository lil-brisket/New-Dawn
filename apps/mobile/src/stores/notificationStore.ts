import { create } from 'zustand';

export interface AppNotification {
  id: string;
  message: string;
  variant: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationState {
  notifications: AppNotification[];
  add: (notification: Omit<AppNotification, 'id'>) => void;
  remove: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  add: (notification) =>
    set((s) => ({
      notifications: [...s.notifications, { ...notification, id: `notif_${Date.now()}` }],
    })),
  remove: (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
}));
