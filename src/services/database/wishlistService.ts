import { supabase } from '@/integrations/supabase/client';

export const wishlistService = {
  async addToWishlist(productId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('wishlist')
      .insert({
        user_id: user.id,
        product_id: productId
      });

    if (error) throw error;
  },

  async removeFromWishlist(productId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) throw error;
  },

  async getWishlist(): Promise<string[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('wishlist')
      .select('product_id')
      .eq('user_id', user.id);

    if (error) throw error;
    return data?.map(item => item.product_id) || [];
  },

  async isInWishlist(productId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }
};
