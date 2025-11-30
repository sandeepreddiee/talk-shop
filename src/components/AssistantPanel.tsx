import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send } from 'lucide-react';
import { VoiceButton } from './VoiceButton';
import { AssistantMessage } from '@/types';
import { assistantService } from '@/services/assistantService';
import { speechService } from '@/services/speechService';
import { useVoiceStore } from '@/stores/useVoiceStore';

interface AssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  context?: any;
}

export const AssistantPanel = ({ isOpen, onClose, context }: AssistantPanelProps) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const setListening = useVoiceStore((state) => state.setListening);

  const quickActions = assistantService.getQuickActions(context);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Greet with context when opened
    if (isOpen && messages.length === 0 && context?.product) {
      const greeting: AssistantMessage = {
        id: 'greeting',
        role: 'assistant',
        content: `Hi! I can help you with ${context.product.name}. Ask me about the price, features, reviews, or anything else! Press Ctrl+V to use voice input.`,
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  }, [isOpen, context]);

  // Add keyboard shortcut for Ctrl+V
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && !isProcessing && !isVoiceInput) {
        e.preventDefault();
        handleVoiceInput();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isProcessing, isVoiceInput]);

  const handleSubmit = async (query: string) => {
    if (!query.trim() || isProcessing) return;

    const userMessage: AssistantMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const response = await assistantService.processQuery(query, context);
      
      const assistantMessage: AssistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Speak the response
      await speechService.speak(response.response);
    } catch (error) {
      console.error('Assistant error:', error);
      const errorMessage: AssistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = async () => {
    setIsVoiceInput(true);
    setListening(true);

    try {
      const transcript = await speechService.startListening();
      setListening(false);
      setIsVoiceInput(false);
      
      if (transcript) {
        await handleSubmit(transcript);
      }
    } catch (error) {
      console.error('Voice input error:', error);
      setListening(false);
      setIsVoiceInput(false);
    }
  };

  const handleQuickAction = (action: string) => {
    handleSubmit(action);
  };

  if (!isOpen) return null;

  return (
    <aside
      className="fixed right-0 top-16 bottom-0 w-96 bg-background border-l shadow-lg z-30 flex flex-col"
      role="complementary"
      aria-label="Voice Helper"
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-lg">Voice Helper</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close voice helper"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">
            <p className="mb-4">Hello! How can I help you today?</p>
            <p className="text-sm">Ask me about products, reviews, or comparisons.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-8'
                    : 'bg-muted mr-8'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t space-y-2">
        <div className="flex flex-wrap gap-2">
          {quickActions.slice(0, 3).map((action, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action)}
              disabled={isProcessing}
              className="text-xs"
            >
              {action}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(input)}
            placeholder="Ask me anything... (Ctrl+V for voice)"
            disabled={isProcessing || isVoiceInput}
            aria-label="Message input"
          />
          <VoiceButton
            isListening={isVoiceInput}
            onClick={handleVoiceInput}
            variant="outline"
          />
          <Button
            onClick={() => handleSubmit(input)}
            disabled={isProcessing || !input.trim()}
            size="icon"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Press Ctrl+V or click the mic to use voice input
        </p>
      </div>
    </aside>
  );
};
