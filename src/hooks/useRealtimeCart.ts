import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCartStore } from '@/stores/useCartStore';

export const useRealtimeCart = () => {
  const refreshCart = useCartStore(state => state.refreshCart);

  useEffect(() => {
    const channel = supabase
      .channel('cart-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart'
        },
        () => {
          refreshCart();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshCart]);
};
