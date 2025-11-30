import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInterfaceProps {
  onSpeakingChange: (speaking: boolean) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onSpeakingChange }) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<RealtimeChat | null>(null);

  const handleMessage = (event: any) => {
    console.log('📩 Received message:', event.type, event);
    
    if (event.type === 'session.created') {
      console.log('✅ Session created successfully');
      toast({
        title: "Connected",
        description: "AI is ready. Start speaking!",
      });
    } else if (event.type === 'response.audio.delta') {
      onSpeakingChange(true);
    } else if (event.type === 'response.audio.done') {
      onSpeakingChange(false);
    } else if (event.type === 'response.done') {
      console.log('✅ Response completed');
    } else if (event.type === 'error') {
      console.error('❌ Realtime API error:', event);
      toast({
        title: "AI Error",
        description: event.error?.message || 'An error occurred with the AI',
        variant: "destructive",
      });
    } else if (event.type === 'input_audio_buffer.speech_started') {
      console.log('🎤 User started speaking');
    } else if (event.type === 'input_audio_buffer.speech_stopped') {
      console.log('🎤 User stopped speaking');
    } else if (event.type === 'conversation.item.input_audio_transcription.completed') {
      console.log('📝 Transcription:', event.transcript);
    }
  };

  const startConversation = async () => {
    setIsLoading(true);
    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      chatRef.current = new RealtimeChat(handleMessage);
      await chatRef.current.init();
      setIsConnected(true);
      
      console.log('🎉 Voice assistant fully initialized and ready');
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start conversation',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const endConversation = () => {
    chatRef.current?.disconnect();
    setIsConnected(false);
    onSpeakingChange(false);
    
    toast({
      title: "Disconnected",
      description: "Voice assistant ended",
    });
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-2">
      {!isConnected ? (
        <>
          <Button 
            onClick={startConversation}
            disabled={isLoading}
            size="lg"
            className="rounded-full h-16 w-16 shadow-lg bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            aria-label="Start voice conversation"
          >
            <Mic className="h-7 w-7" />
          </Button>
          <span className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded backdrop-blur-sm">
            Natural AI Chat
          </span>
        </>
      ) : (
        <>
          <Button 
            onClick={endConversation}
            size="lg"
            variant="destructive"
            className="rounded-full h-16 w-16 shadow-lg animate-pulse"
            aria-label="End voice conversation"
          >
            <MicOff className="h-7 w-7" />
          </Button>
          <span className="text-xs text-destructive bg-background/80 px-2 py-1 rounded backdrop-blur-sm">
            Listening...
          </span>
        </>
      )}
    </div>
  );
};

export default VoiceInterface;
