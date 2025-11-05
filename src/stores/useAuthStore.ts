import { create } from 'zustand';
import { authService } from '@/services/authService';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: authService.isAuthenticated(),
  token: authService.getToken(),

  login: async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (result.success && result.token) {
      set({ isAuthenticated: true, token: result.token });
    }
    return result;
  },

  logout: () => {
    authService.logout();
    set({ isAuthenticated: false, token: null });
  },

  checkAuth: () => {
    set({
      isAuthenticated: authService.isAuthenticated(),
      token: authService.getToken()
    });
  }
}));
