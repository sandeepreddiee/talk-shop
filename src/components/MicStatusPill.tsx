import { Mic, MicOff } from 'lucide-react';
import { useVoiceStore } from '@/stores/useVoiceStore';

export const MicStatusPill = () => {
  const isListening = useVoiceStore((state) => state.isListening);
  const currentTranscript = useVoiceStore((state) => state.currentTranscript);

  if (!isListening) return null;

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-primary text-primary-foreground rounded-2xl shadow-lg flex items-center gap-3 animate-pulse min-w-[300px] max-w-[600px]"
      role="status"
      aria-live="polite"
    >
      <Mic className="h-5 w-5 animate-pulse flex-shrink-0" aria-hidden="true" />
      <div className="flex flex-col flex-1">
        <span className="text-sm font-bold">🎤 LISTENING</span>
        <span className="text-xs opacity-90">Release Ctrl+V when done</span>
        {currentTranscript && (
          <div className="mt-2 pt-2 border-t border-primary-foreground/20">
            <span className="text-xs font-semibold opacity-75">You said:</span>
            <p className="text-sm font-medium mt-1">{currentTranscript}</p>
          </div>
        )}
      </div>
    </div>
  );
};
