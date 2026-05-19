import { create } from 'zustand';

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

interface NotificationsState {
    notifications: Notification[];
    unreadCount: number;

    // Actions
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
    notifications: [],
    unreadCount: 0,

    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: Notification = {
            ...notification,
            id: `notif-${Date.now()}-${Math.random()}`,
            timestamp: new Date().toISOString(),
            read: false,
        };

        set((state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        }));

        // Auto-remove after 5 seconds for toast-style notifications
        setTimeout(() => {
            get().removeNotification(newNotification.id);
        }, 5000);
    },

    markAsRead: (id: string) => {
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
        }));
    },

    markAllAsRead: () => {
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
        }));
    },

    removeNotification: (id: string) => {
        set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            return {
                notifications: state.notifications.filter((n) => n.id !== id),
                unreadCount: notification && !notification.read
                    ? Math.max(0, state.unreadCount - 1)
                    : state.unreadCount,
            };
        });
    },

    clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
    },
}));
