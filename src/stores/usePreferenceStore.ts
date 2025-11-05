import { create } from 'zustand';
import { preferenceService } from '@/services/preferenceService';
import { UserPreferences } from '@/types';

interface PreferenceState extends UserPreferences {
  updatePreference: (key: keyof UserPreferences, value: any) => void;
  loadPreferences: () => void;
}

export const usePreferenceStore = create<PreferenceState>((set) => ({
  ...preferenceService.getPreferences(),

  updatePreference: (key: keyof UserPreferences, value: any) => {
    preferenceService.updatePreferences({ [key]: value });
    set({ [key]: value });
  },

  loadPreferences: () => {
    set(preferenceService.getPreferences());
  }
}));
