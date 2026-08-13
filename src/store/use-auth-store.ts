import { create } from 'zustand';
import type { User, UserRole } from '@/types';
import { demoUsers } from '@/data/mock-data';
import * as api from '@/services/api';
import type { ApiUser } from '@/services/api';

function mapApiUser(u: ApiUser): User {
  return {
    id: u.id, name: u.name, email: u.email, phone: u.phone,
    role: u.role as UserRole, language: u.language || 'en',
    location: u.location || '', state: u.state || '',
    district: u.district || '', village: u.village || '',
    isOnboarded: u.isOnboarded, joinedDate: u.joinedDate,
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: UserRole) => Promise<void>;
  loginWithPhone: (phone: string, password: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; phone: string; password: string; role: UserRole }) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  completeOnboarding: (data: Partial<User>) => void;
  restoreSession: () => Promise<boolean>;
}

const demoCredentials: Record<UserRole, { email: string; password: string }> = {
  farmer: { email: 'vamsi@farm.ai', password: 'demo123' },
  consumer: { email: 'priya@gmail.com', password: 'demo123' },
  collection_center: { email: 'rajesh@greenagri.in', password: 'demo123' },
  expert: { email: 'anitha@agri-expert.in', password: 'demo123' },
  admin: { email: 'admin@krishiai.com', password: 'demo123' },
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (role: UserRole) => {
    set({ isLoading: true });
    try {
      const creds = demoCredentials[role];
      const result = await api.apiLogin(creds.email, creds.password);
      set({ user: mapApiUser(result.user), isAuthenticated: true, isLoading: false });
    } catch {
      // Fallback to mock if backend is down
      await new Promise(r => setTimeout(r, 500));
      set({ user: demoUsers[role], isAuthenticated: true, isLoading: false });
    }
  },

  loginWithPhone: async (phone: string, password: string) => {
    set({ isLoading: true });
    try {
      const result = await api.apiLogin(phone, password);
      set({ user: mapApiUser(result.user), isAuthenticated: true, isLoading: false });
    } catch {
      // Fallback: try demo farmer
      await new Promise(r => setTimeout(r, 500));
      set({ user: { ...demoUsers.farmer, phone }, isAuthenticated: true, isLoading: false });
    }
  },

  loginWithEmail: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const result = await api.apiLogin(email, password);
      set({ user: mapApiUser(result.user), isAuthenticated: true, isLoading: false });
    } catch {
      await new Promise(r => setTimeout(r, 500));
      set({ user: { ...demoUsers.farmer, email }, isAuthenticated: true, isLoading: false });
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const result = await api.apiRegister({ ...data, role: data.role });
      set({ user: mapApiUser(result.user), isAuthenticated: true, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  logout: () => {
    api.apiLogout();
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (data: Partial<User>) => {
    set(state => ({ user: state.user ? { ...state.user, ...data } : null }));
  },

  completeOnboarding: (data: Partial<User>) => {
    set(state => ({ user: state.user ? { ...state.user, ...data, isOnboarded: true } : null }));
  },

  restoreSession: async () => {
    const verified = await api.apiVerifyToken();
    if (verified) {
      try {
        const profile = await api.apiGetProfile();
        set({ user: mapApiUser(profile), isAuthenticated: true });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  },
}));
