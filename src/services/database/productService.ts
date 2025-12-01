import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data.map(p => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      rating: Number(p.rating || 4.5),
      reviewCount: p.reviews || 0,
      category: p.category || 'General',
      image: p.image || '',
      images: [p.image || ''],
      description: p.description || '',
      features: p.features || [],
      inStock: p.in_stock !== false && p.stock_quantity > 0,
      prime: true
    }));
  },

  getProductById: async (id: string): Promise<Product | null> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching product:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      price: Number(data.price),
      rating: Number(data.rating || 4.5),
      reviewCount: data.reviews || 0,
      category: data.category || 'General',
      image: data.image || '',
      images: [data.image || ''],
      description: data.description || '',
      features: data.features || [],
      inStock: data.in_stock !== false && data.stock_quantity > 0,
      prime: true
    };
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    // Search in name, description, and category with case-insensitive pattern matching
    // Also fetch products where keywords might contain the search term
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`);

    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    return data.map(p => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      rating: Number(p.rating || 4.5),
      reviewCount: p.reviews || 0,
      category: p.category || 'General',
      image: p.image || '',
      images: [p.image || ''],
      description: p.description || '',
      features: p.features || [],
      inStock: p.in_stock !== false && p.stock_quantity > 0,
      prime: true
    }));
  },

  updateStock: async (productId: string, quantity: number): Promise<void> => {
    const { error } = await supabase
      .from('products')
      .update({ stock_quantity: quantity })
      .eq('id', productId);

    if (error) {
      console.error('Error updating stock:', error);
    }
  }
};
