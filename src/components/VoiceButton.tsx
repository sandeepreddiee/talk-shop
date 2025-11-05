import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceButtonProps {
  isListening: boolean;
  onClick: () => void;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export const VoiceButton = ({
  isListening,
  onClick,
  size = 'icon',
  variant = 'ghost',
  className = ''
}: VoiceButtonProps) => {
  return (
    <Button
      onClick={onClick}
      size={size}
      variant={variant}
      className={className}
      aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
      aria-pressed={isListening}
    >
      {isListening ? (
        <MicOff className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Mic className="h-5 w-5" aria-hidden="true" />
      )}
    </Button>
  );
};
