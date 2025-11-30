import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types';

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('cart')
      .select('product_id, quantity')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching cart:', error);
      return [];
    }

    return data.map(item => ({
      productId: item.product_id,
      quantity: item.quantity
    }));
  },

  addToCart: async (productId: string, quantity: number = 1): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if item already exists in cart
    const { data: existing } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (existing) {
      // Update existing item
      await supabase
        .from('cart')
        .update({ quantity: existing.quantity + quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);
    } else {
      // Insert new item
      await supabase
        .from('cart')
        .insert({ user_id: user.id, product_id: productId, quantity });
    }
  },

  updateQuantity: async (productId: string, quantity: number): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('cart')
      .update({ quantity: Math.max(1, quantity) })
      .eq('user_id', user.id)
      .eq('product_id', productId);
  },

  removeFromCart: async (productId: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('cart')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);
  },

  clearCart: async (): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('cart')
      .delete()
      .eq('user_id', user.id);
  },

  getItemCount: async (): Promise<number> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { data } = await supabase
      .from('cart')
      .select('quantity')
      .eq('user_id', user.id);

    return data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }
};
