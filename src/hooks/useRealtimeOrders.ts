import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { speechService } from '@/services/speechService';

export const useRealtimeOrders = (onOrderUpdate?: () => void) => {
  useEffect(() => {
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          const newStatus = payload.new.status;
          const oldStatus = payload.old.status;
          
          if (newStatus !== oldStatus) {
            const statusMessages: Record<string, string> = {
              processing: 'Your order is now being processed',
              shipped: 'Your order has been shipped',
              delivered: 'Your order has been delivered',
              cancelled: 'Your order has been cancelled'
            };

            const message = statusMessages[newStatus] || 'Your order status has been updated';
            
            toast.success(message);
            speechService.speak(message);
            
            if (onOrderUpdate) {
              onOrderUpdate();
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onOrderUpdate]);
};
