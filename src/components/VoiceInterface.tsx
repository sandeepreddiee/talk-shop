import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { Mic, MicOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '@/stores/useCartStore';
import { supabase } from '@/integrations/supabase/client';

interface VoiceInterfaceProps {
  onSpeakingChange: (speaking: boolean) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onSpeakingChange }) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<RealtimeChat | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCartStore();

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
      const transcript = (event.transcript || event.transcription || '').toLowerCase();
      console.log('📝 Transcription:', transcript);
      
      // Check if user wants to stop the conversation
      if (transcript.includes('stop listening') || 
          transcript.includes('stop conversation') ||
          transcript.includes('end conversation') ||
          transcript.includes('disconnect') ||
          transcript.includes('stop') ||
          transcript.includes('goodbye') ||
          transcript.includes('bye')) {
        console.log('🛑 User requested to stop conversation');
        endConversation();
      }
    } else if (event.type === 'response.audio_transcript.delta') {
      // Also check AI's transcription of user speech
      const text = (event.delta || '').toLowerCase();
      if (text.includes('stop listening') || text.includes('stop conversation')) {
        console.log('🛑 User requested to stop (from delta)');
        endConversation();
      }
    }
  };

  const getClientTools = () => ({
    add_to_cart: async (args: { quantity?: number }) => {
      const quantity = args.quantity || 1;
      
      // Get current product from URL
      const match = location.pathname.match(/\/product\/([^/]+)/);
      if (!match) {
        return { success: false, message: "No product currently viewing" };
      }
      
      const productId = match[1];
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (!product) {
        return { success: false, message: "Product not found" };
      }
      
      await addItem(productId, quantity);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
      
      return { success: true, message: `Added ${quantity} ${product.name} to cart` };
    },
    
    navigate: async (args: { page: string }) => {
      const routes: Record<string, string> = {
        home: '/',
        cart: '/cart',
        checkout: '/checkout',
        search: '/search',
        wishlist: '/wishlist',
        orders: '/orders'
      };
      
      const route = routes[args.page];
      if (route) {
        navigate(route);
        return { success: true, message: `Navigated to ${args.page}` };
      }
      
      return { success: false, message: "Unknown page" };
    },
    
    get_product_info: async () => {
      const match = location.pathname.match(/\/product\/([^/]+)/);
      if (!match) {
        return { success: false, message: "Not viewing a product" };
      }
      
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', match[1])
        .single();
      
      if (!product) {
        return { success: false, message: "Product not found" };
      }
      
      return {
        success: true,
        product: {
          name: product.name,
          price: product.price,
          originalPrice: product.original_price,
          rating: product.rating,
          reviews: product.reviews,
          description: product.description,
          features: product.features,
          inStock: product.in_stock,
          category: product.category
        }
      };
    }
  });

  const startConversation = async () => {
    setIsLoading(true);
    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      chatRef.current = new RealtimeChat(handleMessage, getClientTools());
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
            aria-label="End voice conversation - Click to stop"
            title="Click to stop listening"
          >
            <MicOff className="h-7 w-7" />
          </Button>
          <span className="text-xs text-destructive bg-background/80 px-2 py-1 rounded backdrop-blur-sm">
            Click to stop or say "stop listening"
          </span>
        </>
      )}
    </div>
  );
};

export default VoiceInterface;
