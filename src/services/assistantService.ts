import { supabase } from '@/integrations/supabase/client';

export const assistantService = {
  processQuery: async (query: string, context?: any): Promise<{ response: string }> => {
    try {
      console.log('🔍 AssistantService - Sending to edge function:', {
        query,
        productName: context?.product?.name,
        productId: context?.product?.id,
        fullContext: context
      });

      const { data, error } = await supabase.functions.invoke('voice-assistant', {
        body: {
          query,
          context
        }
      });

      if (error) throw error;
      
      console.log('✅ AssistantService - Received response:', data);
      return { response: data.response };
    } catch (error) {
      console.error('❌ Assistant error:', error);
      return { 
        response: 'I apologize, I am having trouble processing your request right now. Please try again.' 
      };
    }
  },

  getQuickActions: (context?: any): string[] => {
    if (context?.productId) {
      return [
        'What is the price?',
        'Tell me about the reviews',
        'What are the main features?',
        'Is this in stock?',
        'Add this to cart'
      ];
    }
    
    return [
      'Show me deals',
      'What is popular?',
      'Help me search',
      'What can I do with voice?'
    ];
  }
};
