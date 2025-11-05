import { Mic, MicOff } from 'lucide-react';
import { useVoiceStore } from '@/stores/useVoiceStore';

export const MicStatusPill = () => {
  const isListening = useVoiceStore((state) => state.isListening);

  if (!isListening) return null;

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center gap-2 animate-pulse"
      role="status"
      aria-live="polite"
    >
      <Mic className="h-4 w-4" aria-hidden="true" />
      <span className="text-sm font-medium">Listening... press Ctrl+V to stop</span>
    </div>
  );
};
