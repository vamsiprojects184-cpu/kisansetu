import { create } from 'zustand';
import type { User, UserRole } from '@/types';
import { demoUsers } from '@/data/mock-data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: UserRole) => Promise<void>;
  loginWithPhone: (phone: string) => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  completeOnboarding: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (role: UserRole) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 800));
    const user = demoUsers[role];
    set({ user, isAuthenticated: true, isLoading: false });
  },

  loginWithPhone: async (phone: string) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 800));
    // Default to farmer for phone login
    const user = { ...demoUsers.farmer, phone };
    set({ user, isAuthenticated: true, isLoading: false });
  },

  loginWithEmail: async (email: string) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 800));
    const user = { ...demoUsers.farmer, email };
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (data: Partial<User>) => {
    set(state => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },

  completeOnboarding: (data: Partial<User>) => {
    set(state => ({
      user: state.user ? { ...state.user, ...data, isOnboarded: true } : null,
    }));
  },
}));
