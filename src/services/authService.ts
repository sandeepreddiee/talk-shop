const STORAGE_KEY = 'auth_token';
const MOCK_EMAIL = 'user@demo.com';
const MOCK_PASSWORD = 'password123';

export const authService = {
  login: (email: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
          const token = 'mock_token_' + Date.now();
          localStorage.setItem(STORAGE_KEY, token);
          resolve({ success: true, token });
        } else {
          resolve({ success: false, error: 'Invalid credentials' });
        }
      }, 500);
    });
  },

  logout: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEY);
  },

  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEY);
  }
};
