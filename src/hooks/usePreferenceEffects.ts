import { useEffect } from 'react';
import { usePreferenceStore } from '@/stores/usePreferenceStore';

export const usePreferenceEffects = () => {
  const { highContrast, textSize } = usePreferenceStore();

  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Text size
    const textSizeClasses = ['text-sm', 'text-base', 'text-lg', 'text-xl'];
    textSizeClasses.forEach(cls => root.classList.remove(cls));
    
    const sizeMap: Record<string, string> = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
      xl: 'text-xl'
    };
    
    root.classList.add(sizeMap[textSize]);
  }, [highContrast, textSize]);
};
