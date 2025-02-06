import create from 'zustand';
import { authService, ProfileUpdateData } from '../services/auth.service';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  initialize: async () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      set({ user: JSON.parse(user), isAuthenticated: true });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      set({ user: response.user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      const response = await authService.register(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      set({ user: response.user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (data: ProfileUpdateData) => {
    try {
      const response = await authService.updateProfile(data);
      const updatedUser = { ...response.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (error) {
      throw error;
    }
  },

  signOut: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));