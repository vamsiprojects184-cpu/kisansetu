import { create } from 'zustand';
import type { RoutePath, Notification } from '@/types';
import { mockNotifications } from '@/data/mock-data';

interface AppState {
  currentRoute: RoutePath;
  routeParams: Record<string, string>;
  previousRoute: RoutePath | null;
  notifications: Notification[];
  isChatOpen: boolean;
  isLoading: boolean;
  sidebarOpen: boolean;

  navigate: (route: RoutePath, params?: Record<string, string>) => void;
  goBack: () => void;
  setNotifications: (notifications: Notification[]) => void;
  markNotificationRead: (id: string) => void;
  unreadCount: () => number;
  toggleChat: () => void;
  setChatOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentRoute: 'landing',
  routeParams: {},
  previousRoute: null,
  notifications: mockNotifications,
  isChatOpen: false,
  isLoading: false,
  sidebarOpen: true,

  navigate: (route: RoutePath, params = {}) => {
    const state = get();
    set({
      previousRoute: state.currentRoute,
      currentRoute: route,
      routeParams: params,
      isChatOpen: false,
    });
  },

  goBack: () => {
    const state = get();
    if (state.previousRoute) {
      set({
        currentRoute: state.previousRoute,
        previousRoute: null,
      });
    }
  },

  setNotifications: (notifications) => set({ notifications }),

  markNotificationRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  unreadCount: () => {
    return get().notifications.filter(n => !n.read).length;
  },

  toggleChat: () => set(state => ({ isChatOpen: !state.isChatOpen })),
  setChatOpen: (open) => set({ isChatOpen: open }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));