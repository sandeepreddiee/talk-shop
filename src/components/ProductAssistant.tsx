import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';
import { Product } from '@/types';
import { speechService } from '@/services/speechService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ProductAssistantProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductAssistant = ({ product, open, onOpenChange }: ProductAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      // Welcome message
      const welcomeMsg = `Hi! I'm here to help you with the ${product.name}. What would you like to know?`;
      setMessages([{ role: 'assistant', content: welcomeMsg }]);
      speechService.speak(welcomeMsg);
    } else {
      // Clean up when closed
      setMessages([]);
      if (isListening) {
        stopListening();
      }
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = async () => {
    try {
      setIsListening(true);
      const transcript = await speechService.startListening();
      
      // Check if user said "stop listening"
      if (transcript.toLowerCase().includes('stop listening')) {
        speechService.speak('Closing assistant');
        onOpenChange(false);
        return;
      }

      if (transcript && transcript.trim()) {
        await sendMessage(transcript);
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
      toast.error('Could not access microphone');
    } finally {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    speechService.stopListening();
    setIsListening(false);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('product-assistant', {
        body: {
          messages: [...messages, userMessage],
          product: {
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            rating: product.rating,
            reviewCount: product.reviewCount,
            description: product.description,
            features: product.features,
            inStock: product.inStock
          }
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message
      };

      setMessages(prev => [...prev, assistantMessage]);
      speechService.speak(data.message);
    } catch (error: any) {
      console.error('Assistant error:', error);
      
      let errorMsg = 'Sorry, I encountered an error. Please try again.';
      if (error.message?.includes('429')) {
        errorMsg = 'Too many requests. Please wait a moment.';
      } else if (error.message?.includes('402')) {
        errorMsg = 'AI service unavailable. Please try again later.';
      }
      
      toast.error(errorMsg);
      const errorMessage: Message = { role: 'assistant', content: errorMsg };
      setMessages(prev => [...prev, errorMessage]);
      speechService.speak(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendText = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Product Assistant - {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t pt-4 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your question or use voice..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isProcessing || isListening}
            />
            <Button
              onClick={handleSendText}
              disabled={!inputText.trim() || isProcessing || isListening}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              variant={isListening ? 'destructive' : 'default'}
              className="flex-1"
            >
              {isListening ? (
                <>
                  <MicOff className="mr-2 h-4 w-4" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Start Voice
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Say "stop listening" to close the assistant
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
