import { useEffect, useRef } from 'react';
import { useVoiceStore } from '@/stores/useVoiceStore';

interface LiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
}

export const LiveRegion = ({ message, priority = 'polite' }: LiveRegionProps) => {
  const regionRef = useRef<HTMLDivElement>(null);
  const isAISpeaking = useVoiceStore((state) => state.isAISpeaking);

  useEffect(() => {
    // Don't announce if AI is speaking to avoid conflicts
    if (regionRef.current && message && !isAISpeaking) {
      regionRef.current.textContent = message;
    } else if (regionRef.current && isAISpeaking) {
      // Clear the region when AI starts speaking
      regionRef.current.textContent = '';
    }
  }, [message, isAISpeaking]);

  return (
    <div
      ref={regionRef}
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    />
  );
};
