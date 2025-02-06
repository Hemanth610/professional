import api from './api';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(email: string, password: string): Promise<AuthResponse> {
    const username = email.split('@')[0]; // Create username from email
    const response = await api.post('/auth/register', { 
      email, 
      password,
      username 
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};