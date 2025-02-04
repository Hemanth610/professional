import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  username: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  email_notifications: boolean;
  is_public: boolean;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const LOCAL_STORAGE_KEY = 'recipe_remix_auth';
const LOCAL_USERS_KEY = 'recipe_remix_users';
const LOCAL_PROFILES_KEY = 'recipe_remix_profiles';

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

const getProfileFromLocalStorage = (userId: string): UserProfile | null => {
  const profiles = JSON.parse(localStorage.getItem(LOCAL_PROFILES_KEY) || '{}');
  return profiles[userId] || null;
};

const saveProfileToLocalStorage = (userId: string, profile: Partial<UserProfile>) => {
  const profiles = JSON.parse(localStorage.getItem(LOCAL_PROFILES_KEY) || '{}');
  profiles[userId] = {
    ...profiles[userId],
    ...profile,
    id: userId,
  };
  localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(profiles));
  return profiles[userId];
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialize: async () => {
    try {
      const localUser = getFromLocalStorage();
      if (localUser) {
        const profile = getProfileFromLocalStorage(localUser.id);
        set({ user: localUser, profile });
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
        const profile = getProfileFromLocalStorage(userId);
        set({ user, profile });
        return;
      }
      throw new Error('Invalid email or password');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    }
  },
  signUp: async (email, password) => {
    try {
      const userId = crypto.randomUUID();
      saveUserToLocalUsers(email, password);
      const user = {
        id: userId,
        email,
        username: email.split('@')[0],
      };
      saveToLocalStorage(user);
      // Initialize empty profile
      const profile = saveProfileToLocalStorage(userId, {
        id: userId,
        full_name: '',
        bio: '',
        avatar_url: '',
        email_notifications: false,
        is_public: true,
      });
      set({ user, profile });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign up');
    }
  },
  signOut: async () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      set({ user: null, profile: null });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  },
  updateProfile: async (data: Partial<UserProfile>) => {
    try {
      const { user } = get();
      if (!user) throw new Error('No user logged in');
      
      const updatedProfile = saveProfileToLocalStorage(user.id, data);
      set({ profile: updatedProfile });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  },
}));