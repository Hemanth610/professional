import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

const LOCAL_STORAGE_KEY = 'recipe_remix_auth';
const LOCAL_USERS_KEY = 'recipe_remix_users';

const saveToLocalStorage = (user: User) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
};

const getFromLocalStorage = (): User | null => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

const saveUserToLocalUsers = (email: string, password: string) => {
  const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '{}');
  users[email] = { password, id: crypto.randomUUID() };
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

const validateLocalUser = (email: string, password: string) => {
  const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '{}');
  return users[email]?.password === password ? users[email].id : null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialize: async () => {
    try {
      const localUser = getFromLocalStorage();
      if (localUser) {
        set({ user: localUser });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      set({ loading: false });
    }
  },
  signIn: async (email, password) => {
    try {
      const userId = validateLocalUser(email, password);
      if (userId) {
        const user = {
          id: userId,
          email,
          username: email.split('@')[0],
        };
        saveToLocalStorage(user);
        set({ user });
        return;
      }
      throw new Error('Invalid email or password');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    }
  },
  signUp: async (email, password) => {
    try {
      saveUserToLocalUsers(email, password);
      const user = {
        id: crypto.randomUUID(),
        email,
        username: email.split('@')[0],
      };
      saveToLocalStorage(user);
      set({ user });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign up');
    }
  },
  signOut: async () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      set({ user: null });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  },
}));