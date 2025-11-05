import { UserPreferences } from '@/types';

const STORAGE_KEY = 'user_preferences';

const defaultPreferences: UserPreferences = {
  highContrast: false,
  textSize: 'medium',
  voiceVerbosity: 'detailed',
  voiceFirstMode: true
};

export const preferenceService = {
  getPreferences: (): UserPreferences => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
  },

  updatePreferences: (preferences: Partial<UserPreferences>): void => {
    const current = preferenceService.getPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};
