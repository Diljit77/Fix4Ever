import { create } from "zustand";

interface NotificationState {
  notifications: any[];
  setNotifications: (n: any[]) => void;
  addNotification: (n: any) => void;
  markRead: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  setNotifications: (n) => set({ notifications: n }),
  addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications] })),
  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n._id === id ? { ...n, read: true } : n)),
    })),
}));
