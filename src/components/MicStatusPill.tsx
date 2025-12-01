import { Mic, MicOff } from 'lucide-react';
import { useVoiceStore } from '@/stores/useVoiceStore';

export const MicStatusPill = () => {
  const isListening = useVoiceStore((state) => state.isListening);

  if (!isListening) return null;

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center gap-3 animate-pulse"
      role="status"
      aria-live="polite"
    >
      <Mic className="h-5 w-5 animate-pulse" aria-hidden="true" />
      <div className="flex flex-col">
        <span className="text-sm font-bold">🎤 LISTENING</span>
        <span className="text-xs opacity-90">Speak now! Release Ctrl+V when done</span>
      </div>
    </div>
  );
};
