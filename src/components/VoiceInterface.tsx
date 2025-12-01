import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '@/stores/useCartStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useVoiceStore } from '@/stores/useVoiceStore';
import { useCheckoutStore } from '@/stores/useCheckoutStore';
import { supabase } from '@/integrations/supabase/client';
import { speechService } from '@/services/speechService';
import { productService } from '@/services/database/productService';

interface VoiceInterfaceProps {
  onSpeakingChange: (speaking: boolean) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onSpeakingChange }) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const chatRef = useRef<RealtimeChat | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem, refreshCart } = useCartStore();
  const { setAISpeaking } = useVoiceStore();

  const handleMessage = (event: any) => {
    console.log('📩 Event:', event.type);
    
    if (event.type === 'session.created') {
      console.log('✅ Session ready');
      speechService.stopSpeaking();
      toast({
        title: "Connected",
        description: "AI assistant ready - start speaking!",
      });
    } else if (event.type === 'response.audio.delta') {
      speechService.stopSpeaking();
      setAISpeaking(true);
      onSpeakingChange(true);
    } else if (event.type === 'response.audio.done') {
      setAISpeaking(false);
      onSpeakingChange(false);
    } else if (event.type === 'error') {
      console.error('❌ Error:', event.error);
      toast({
        title: "Error",
        description: event.error?.message || 'Something went wrong',
        variant: "destructive",
      });
    } else if (event.type === 'input_audio_buffer.speech_started') {
      console.log('🎤 You are speaking');
      setUserSpeaking(true);
      speechService.stopSpeaking();
    } else if (event.type === 'input_audio_buffer.speech_stopped') {
      console.log('🎤 You stopped speaking');
      setUserSpeaking(false);
    } else if (event.type === 'conversation.item.input_audio_transcription.completed') {
      const transcript = (event.transcript || event.transcription || '').toLowerCase();
      console.log('📝 You said:', transcript);
      
      if (transcript.includes('stop listening') || 
          transcript.includes('stop conversation') ||
          transcript.includes('goodbye') ||
          transcript.includes('bye')) {
        console.log('🛑 Ending conversation');
        endConversation();
      }
    }
  };

  const getClientTools = () => ({
    search_products: async (args: { query: string; category?: string }) => {
      console.log('🔍 Searching with keywords:', args);
      try {
        // Use productService which now searches through keywords
        const results = await productService.searchProducts(args.query);
        
        // Filter by category if specified
        let filteredResults = results;
        if (args.category) {
          filteredResults = results.filter(p => 
            p.category.toLowerCase() === args.category?.toLowerCase()
          );
        }
        
        if (filteredResults.length === 0) {
          return { success: false, message: `No products found for "${args.query}"` };
        }
        
        navigate(`/s/${encodeURIComponent(args.query)}`);
        return { 
          success: true, 
          message: `Found ${filteredResults.length} products matching "${args.query}"`,
          products: filteredResults.slice(0, 5).map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            rating: p.rating,
            category: p.category,
            description: p.description
          }))
        };
      } catch (error) {
        console.error('Search error:', error);
        return { success: false, message: "Search failed" };
      }
    },

    get_products: async (args: any = {}) => {
      console.log('📦 Getting products:', args);
      try {
        let query = supabase
          .from('products')
          .select('*');
        
        if (args.category) query = query.eq('category', args.category);
        if (args.minPrice) query = query.gte('price', args.minPrice);
        if (args.maxPrice) query = query.lte('price', args.maxPrice);
        if (args.minRating) query = query.gte('rating', args.minRating);
        if (args.onlyDeals) query = query.not('original_price', 'is', null);
        
        // Sorting
        if (args.sortBy === 'price_asc') query = query.order('price', { ascending: true });
        else if (args.sortBy === 'price_desc') query = query.order('price', { ascending: false });
        else if (args.sortBy === 'rating') query = query.order('rating', { ascending: false });
        else if (args.sortBy === 'name') query = query.order('name', { ascending: true });
        
        query = query.limit(args.limit || 10);
        
        const { data, error } = await query;
        if (error) throw error;
        
        return { 
          success: true, 
          message: `Found ${data?.length || 0} products`,
          products: data 
        };
      } catch (error) {
        console.error('Get products error:', error);
        return { success: false, message: "Failed to get products" };
      }
    },

    view_product: async (args: { productId?: string; productName?: string } = {}) => {
      console.log('👁️ Opening product page:', args);
      try {
        let productId = args.productId;
        
        // If productName provided, search for the product
        if (!productId && args.productName) {
          console.log('👁️ Searching by name:', args.productName);
          const { data: product, error: searchError } = await supabase
            .from('products')
            .select('id, name')
            .ilike('name', `%${args.productName}%`)
            .limit(1)
            .single();
          
          console.log('👁️ Search result:', product);
          if (product) {
            productId = product.id;
          }
        }
        
        if (!productId) {
          return { success: false, message: "Please specify which product to open" };
        }
        
        navigate(`/product/${productId}`);
        return { 
          success: true, 
          message: "Opening product page" 
        };
      } catch (error) {
        console.error('View product error:', error);
        return { success: false, message: "Failed to open product" };
      }
    },

    get_product_details: async (args: { productId?: string } = {}) => {
      console.log('📋 Getting product details:', args);
      try {
        let productId = args.productId;
        
        // If no productId, try to get from current URL
        if (!productId) {
          const match = location.pathname.match(/\/product\/([^/]+)/);
          if (!match) {
            return { success: false, message: "Not viewing a product. Please provide a product ID or navigate to a product page." };
          }
          productId = match[1];
        }
        
        const { data: product, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (error) throw error;
        if (!product) return { success: false, message: "Product not found" };
        
        // Navigate if not already on product page
        if (!location.pathname.includes(productId)) {
          navigate(`/product/${productId}`);
        }
        
        return {
          success: true,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.original_price,
            rating: product.rating,
            reviewCount: product.reviews,
            description: product.description,
            features: product.features,
            inStock: product.in_stock,
            stockQuantity: product.stock_quantity,
            category: product.category
          }
        };
      } catch (error) {
        console.error('Get product details error:', error);
        return { success: false, message: "Failed to get product details" };
      }
    },

    add_to_cart: async (args: { productId?: string; productName?: string; quantity?: number } = {}) => {
      console.log('🛒 Adding to cart - Args:', JSON.stringify(args));
      console.log('🛒 Current location:', location.pathname);
      const quantity = args.quantity || 1;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('🛒 User authenticated:', !!user);
        
        if (!user) return { success: false, message: "Please log in first" };
        
        let productId = args.productId;
        
        // If productName provided, search for the product
        if (!productId && args.productName) {
          console.log('🛒 Searching by name:', args.productName);
          const { data: product, error: searchError } = await supabase
            .from('products')
            .select('id, name')
            .ilike('name', `%${args.productName}%`)
            .limit(1)
            .single();
          
          console.log('🛒 Search result:', product, 'Error:', searchError);
          productId = product?.id;
        }
        
        // If still no productId, try to get from current URL
        if (!productId) {
          const match = location.pathname.match(/\/product\/([^/]+)/);
          productId = match?.[1];
          console.log('🛒 Extracted from URL:', productId);
        }
        
        if (!productId) {
          console.error('🛒 No product ID found');
          return { success: false, message: "No product specified. Please tell me which product or navigate to a product page." };
        }
        
        console.log('🛒 Final product ID:', productId);
        
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('name, price')
          .eq('id', productId)
          .single();
        
        console.log('🛒 Product found:', product, 'Error:', productError);
        
        if (!product || productError) {
          return { success: false, message: "Product not found" };
        }
        
        console.log('🛒 Adding to cart via store...');
        await addItem(productId, quantity);
        
        // Force refresh cart to ensure UI updates
        console.log('🛒 Refreshing cart...');
        await refreshCart();
        
        console.log('🛒 Cart updated successfully');
        
        toast({
          title: "Added to cart",
          description: `${product.name} × ${quantity}`,
        });
        
        return { 
          success: true, 
          message: `Added ${quantity} ${product.name} to your cart. Total price: $${(product.price * quantity).toFixed(2)}` 
        };
      } catch (error: any) {
        console.error('🛒 Add to cart error:', error);
        if (error?.message === 'User not authenticated') {
          return { success: false, message: "Please log in first" };
        }
        return { success: false, message: `Failed to add to cart: ${error.message}` };
      }
    },

    view_cart: async () => {
      console.log('👀 Viewing cart');
      try {
        const { data: cartItems, error } = await supabase
          .from('cart')
          .select(`
            product_id,
            quantity,
            products (name, price, image)
          `)
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
        
        if (error) throw error;
        
        if (!cartItems || cartItems.length === 0) {
          return { success: true, message: "Your cart is empty", items: [] };
        }
        
        const items = cartItems.map((item: any) => ({
          productId: item.product_id,
          name: item.products.name,
          price: item.products.price,
          quantity: item.quantity,
          subtotal: item.products.price * item.quantity
        }));
        
        const total = items.reduce((sum: number, item: any) => sum + item.subtotal, 0);
        
        navigate('/cart');
        return {
          success: true,
          message: `You have ${items.length} items in cart. Total: $${total.toFixed(2)}`,
          items,
          total
        };
      } catch (error) {
        console.error('View cart error:', error);
        return { success: false, message: "Failed to load cart" };
      }
    },

    update_cart_quantity: async (args: { productId: string; quantity: number }) => {
      console.log('📝 Updating cart:', args);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, message: "Please log in" };
        
        if (args.quantity === 0) {
          // Remove item
          const { error } = await supabase
            .from('cart')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', args.productId);
          
          if (error) throw error;
          
          toast({ title: "Removed from cart" });
          return { success: true, message: "Item removed from cart" };
        } else {
          // Update quantity
          const { error } = await supabase
            .from('cart')
            .update({ quantity: args.quantity })
            .eq('user_id', user.id)
            .eq('product_id', args.productId);
          
          if (error) throw error;
          
          toast({ title: "Quantity updated" });
          return { success: true, message: `Quantity updated to ${args.quantity}` };
        }
      } catch (error) {
        console.error('Update cart error:', error);
        return { success: false, message: "Failed to update cart" };
      }
    },

    add_to_wishlist: async (args: { productId?: string } = {}) => {
      console.log('❤️ Adding to wishlist:', args);
      try {
        let productId = args.productId;
        
        if (!productId) {
          const match = location.pathname.match(/\/product\/([^/]+)/);
          if (!match) {
            return { success: false, message: "No product specified" };
          }
          productId = match[1];
        }
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, message: "Please log in" };
        
        const { data: product } = await supabase
          .from('products')
          .select('name')
          .eq('id', productId)
          .single();
        
        const { error } = await supabase
          .from('wishlist')
          .insert({ user_id: user.id, product_id: productId });
        
        if (error) {
          if (error.code === '23505') {
            return { success: false, message: "Already in wishlist" };
          }
          throw error;
        }
        
        toast({ title: "Added to wishlist", description: product?.name });
        return { success: true, message: `Added ${product?.name} to wishlist` };
      } catch (error) {
        console.error('Add to wishlist error:', error);
        return { success: false, message: "Failed to add to wishlist" };
      }
    },

    remove_from_wishlist: async (args: { productId: string }) => {
      console.log('💔 Removing from wishlist:', args);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, message: "Please log in" };
        
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', args.productId);
        
        if (error) throw error;
        
        toast({ title: "Removed from wishlist" });
        return { success: true, message: "Removed from wishlist" };
      } catch (error) {
        console.error('Remove from wishlist error:', error);
        return { success: false, message: "Failed to remove from wishlist" };
      }
    },

    view_wishlist: async () => {
      console.log('💝 Viewing wishlist');
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, message: "Please log in" };
        
        const { data, error } = await supabase
          .from('wishlist')
          .select(`
            product_id,
            products (name, price, rating)
          `)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          return { success: true, message: "Your wishlist is empty", items: [] };
        }
        
        navigate('/wishlist');
        return {
          success: true,
          message: `You have ${data.length} items in your wishlist`,
          items: data.map((item: any) => ({
            productId: item.product_id,
            name: item.products.name,
            price: item.products.price,
            rating: item.products.rating
          }))
        };
      } catch (error) {
        console.error('View wishlist error:', error);
        return { success: false, message: "Failed to load wishlist" };
      }
    },

    navigate: async (args: { destination: string; productId?: string }) => {
      console.log('🧭 Navigating:', args);
      try {
        const routes: Record<string, string> = {
          home: '/',
          cart: '/cart',
          checkout: '/checkout',
          wishlist: '/wishlist',
          orders: '/orders',
          account: '/account'
        };
        
        if (args.productId) {
          navigate(`/product/${args.productId}`);
          return { success: true, message: `Opening product page` };
        }
        
        const route = routes[args.destination];
        if (route) {
          navigate(route);
          return { success: true, message: `Navigated to ${args.destination}` };
        }
        
        return { success: false, message: "Unknown destination" };
      } catch (error) {
        console.error('Navigation error:', error);
        return { success: false, message: "Navigation failed" };
      }
    },

    get_reviews: async (args: { productId?: string; minRating?: number } = {}) => {
      console.log('⭐ Getting reviews:', args);
      try {
        let productId = args.productId;
        
        if (!productId) {
          const match = location.pathname.match(/\/product\/([^/]+)/);
          if (!match) {
            return { success: false, message: "No product specified" };
          }
          productId = match[1];
        }
        
        let query = supabase
          .from('reviews')
          .select('rating, title, content, verified_purchase, helpful_count')
          .eq('product_id', productId)
          .order('helpful_count', { ascending: false });
        
        if (args.minRating) {
          query = query.gte('rating', args.minRating);
        }
        
        const { data, error } = await query.limit(5);
        if (error) throw error;
        
        if (!data || data.length === 0) {
          return { success: true, message: "No reviews yet for this product", reviews: [] };
        }
        
        return {
          success: true,
          message: `Found ${data.length} reviews`,
          reviews: data.map(r => ({
            rating: r.rating,
            title: r.title,
            content: r.content,
            verified: r.verified_purchase
          }))
        };
      } catch (error) {
        console.error('Get reviews error:', error);
        return { success: false, message: "Failed to load reviews" };
      }
    },

    compare_products: async (args: { productIds: string[] }) => {
      console.log('⚖️ Comparing products:', args);
      try {
        if (!args.productIds || args.productIds.length < 2) {
          return { success: false, message: "Need at least 2 products to compare" };
        }
        
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, rating, features, description')
          .in('id', args.productIds);
        
        if (error) throw error;
        
        return {
          success: true,
          message: `Comparing ${data?.length} products`,
          products: data
        };
      } catch (error) {
        console.error('Compare error:', error);
        return { success: false, message: "Comparison failed" };
      }
    },

    get_recommendations: async (args: { category?: string; maxPrice?: number } = {}) => {
      console.log('💡 Getting recommendations:', args);
      try {
        let query = supabase
          .from('products')
          .select('id, name, price, rating, category')
          .eq('is_featured', true)
          .gte('rating', 4.5);
        
        if (args.category) query = query.eq('category', args.category);
        if (args.maxPrice) query = query.lte('price', args.maxPrice);
        
        const { data, error } = await query
          .order('rating', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        return {
          success: true,
          message: `Here are ${data?.length || 0} recommendations`,
          recommendations: data
        };
      } catch (error) {
        console.error('Recommendations error:', error);
        return { success: false, message: "Failed to get recommendations" };
      }
    },

    view_orders: async (args: { limit?: number } = {}) => {
      console.log('📦 Viewing orders:', args);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, message: "Please log in" };
        
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            total,
            status,
            created_at,
            order_items (
              quantity,
              price,
              products (name)
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(args.limit || 5);
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          return { success: true, message: "No orders yet", orders: [] };
        }
        
        navigate('/orders');
        return {
          success: true,
          message: `You have ${data.length} recent orders`,
          orders: data.map(order => ({
            id: order.id,
            total: order.total,
            status: order.status,
            date: order.created_at,
            itemCount: order.order_items?.length || 0
          }))
        };
      } catch (error) {
        console.error('View orders error:', error);
        return { success: false, message: "Failed to load orders" };
      }
    },

    update_preferences: async (args: { highContrast?: boolean; textSize?: string }) => {
      console.log('⚙️ Updating preferences:', args);
      try {
        const { usePreferenceStore } = await import('@/stores/usePreferenceStore');
        const store = usePreferenceStore.getState();
        
        if (args.highContrast !== undefined) {
          store.updatePreference('highContrast', args.highContrast);
          toast({ title: `High contrast ${args.highContrast ? 'enabled' : 'disabled'}` });
        }
        
        if (args.textSize) {
          store.updatePreference('textSize', args.textSize);
          toast({ title: `Text size changed to ${args.textSize}` });
        }
        
        navigate('/account');
        return { success: true, message: "Preferences updated" };
      } catch (error) {
        console.error('Update preferences error:', error);
        return { success: false, message: "Failed to update preferences" };
      }
    },
    
    lookup_city_by_zip: async (args: { zipCode: string }) => {
      console.log('🔍 Looking up city for ZIP:', args.zipCode);
      try {
        const { data, error } = await supabase.functions.invoke('lookup-zip', {
          body: { zipCode: args.zipCode }
        });

        if (error) throw error;
        
        if (!data.city) {
          return { 
            success: false, 
            message: "Could not find city for that ZIP code. Please verify and try again." 
          };
        }

        console.log('🔍 Found city:', data.city);
        return {
          success: true,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          message: `Found ${data.city}, ${data.state}`
        };
      } catch (error) {
        console.error('ZIP lookup error:', error);
        return { success: false, message: "Failed to lookup ZIP code" };
      }
    },

    update_shipping_address: async (args: { address?: string; city?: string; zipCode?: string }) => {
      console.log('📮 Updating shipping address:', args);
      console.log('📮 Current page:', location.pathname);
      try {
        // Get checkout store
        const checkoutStore = useCheckoutStore.getState();
        console.log('📮 Current checkout state:', {
          address: checkoutStore.address,
          city: checkoutStore.city,
          zipCode: checkoutStore.zipCode
        });
        
        // Update fields
        const updatedFields: string[] = [];
        
        if (args.address) {
          console.log('📮 Setting address to:', args.address);
          checkoutStore.setAddress(args.address);
          updatedFields.push('street address');
        }
        
        if (args.city) {
          console.log('📮 Setting city to:', args.city);
          checkoutStore.setCity(args.city);
          updatedFields.push('city');
        }
        
        if (args.zipCode) {
          console.log('📮 Setting zip code to:', args.zipCode);
          checkoutStore.setZipCode(args.zipCode);
          updatedFields.push('ZIP code');
        }
        
        if (updatedFields.length === 0) {
          return { success: false, message: "Please tell me the address details you'd like to update." };
        }
        
        // Verify update
        const newState = useCheckoutStore.getState();
        console.log('📮 Updated checkout state:', {
          address: newState.address,
          city: newState.city,
          zipCode: newState.zipCode
        });
        
        toast({
          title: "Address Updated",
          description: `Updated: ${updatedFields.join(', ')}`,
        });
        
        return { 
          success: true,
          message: `Successfully updated ${updatedFields.join(', ')}. Current address: ${newState.address || 'not set'}, ${newState.city || 'not set'}, ${newState.zipCode || 'not set'}`
        };
      } catch (error) {
        console.error('❌ Update address error:', error);
        return { success: false, message: `Failed to update address: ${error instanceof Error ? error.message : 'Unknown error'}` };
      }
    },
    
    place_order: async () => {
      console.log('✅ Placing order');
      try {
        if (!location.pathname.includes('/checkout')) {
          return { success: false, message: "Not on checkout page" };
        }
        
        const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton) {
          submitButton.click();
          return { success: true, message: "Placing your order..." };
        }
        
        return { success: false, message: "Could not find order form" };
      } catch (error) {
        console.error('Place order error:', error);
        return { success: false, message: "Failed to place order" };
      }
    }
  });

  const startConversation = async () => {
    setIsLoading(true);
    try {
      console.log('🚀 Starting AI assistant...');
      speechService.stopSpeaking();
      
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ Microphone access granted');
      
      chatRef.current = new RealtimeChat(handleMessage, getClientTools());
      await chatRef.current.init();
      setIsConnected(true);
      
      console.log('🎉 AI assistant ready');
    } catch (error) {
      console.error('❌ Start error:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : 'Failed to start assistant',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const endConversation = () => {
    console.log('👋 Ending conversation');
    chatRef.current?.disconnect();
    setIsConnected(false);
    setUserSpeaking(false);
    setAISpeaking(false);
    onSpeakingChange(false);
    
    toast({
      title: "Disconnected",
      description: "AI assistant ended",
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
            className="rounded-full h-16 w-16 shadow-lg bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all"
            aria-label="Start AI conversation"
          >
            {isLoading ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : (
              <Mic className="h-7 w-7" />
            )}
          </Button>
          <span className="text-xs text-muted-foreground bg-background/90 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
            {isLoading ? 'Connecting...' : 'AI Helper'}
          </span>
        </>
      ) : (
        <>
          <Button 
            onClick={endConversation}
            size="lg"
            variant="destructive"
            className={`rounded-full h-16 w-16 shadow-lg transition-all ${
              userSpeaking ? 'ring-4 ring-primary animate-pulse' : ''
            }`}
            aria-label="End conversation"
            title="Click to stop or say goodbye"
          >
            <MicOff className="h-7 w-7" />
          </Button>
          <span className="text-xs text-destructive bg-background/90 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
            {userSpeaking ? 'Listening...' : 'Connected'}
          </span>
        </>
      )}
    </div>
  );
};

export default VoiceInterface;
