import { supabase } from '@/integrations/supabase/client';

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  content: string;
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
}

export const reviewService = {
  getProductReviews: async (productId: string): Promise<Review[]> => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    return data || [];
  }
};
