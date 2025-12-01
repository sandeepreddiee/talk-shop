import { supabase } from '@/integrations/supabase/client';
import { useCartStore } from '@/stores/useCartStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useCheckoutStore } from '@/stores/useCheckoutStore';
import { productService } from '@/services/database/productService';
import { speechService } from '@/services/speechService';

interface CommandResult {
  success: boolean;
  message: string;
  action?: 'navigate' | 'update' | 'none';
  destination?: string;
}

export class VoiceCommandHandler {
  private navigate: (path: string) => void;
  private location: { pathname: string };
  private toast: (options: any) => void;

  constructor(
    navigate: (path: string) => void,
    location: { pathname: string },
    toast: (options: any) => void
  ) {
    this.navigate = navigate;
    this.location = location;
    this.toast = toast;
  }

  async processCommand(transcript: string): Promise<CommandResult> {
    const text = transcript.toLowerCase().trim();
    console.log('🎤 Processing command:', text);

    // Navigation commands
    if (this.matchesPatterns(text, ['go home', 'home page', 'take me home', 'go to home'])) {
      this.navigate('/');
      return { success: true, message: 'Going home' };
    }

    if (this.matchesPatterns(text, ['open cart', 'view cart', 'show cart', 'go to cart', 'shopping cart'])) {
      this.navigate('/cart');
      return { success: true, message: 'Opening cart' };
    }

    if (this.matchesPatterns(text, ['checkout', 'go to checkout', 'proceed to checkout'])) {
      this.navigate('/checkout');
      return { success: true, message: 'Going to checkout' };
    }

    if (this.matchesPatterns(text, ['orders', 'my orders', 'order history', 'view orders', 'show orders'])) {
      this.navigate('/orders');
      return { success: true, message: 'Opening orders' };
    }

    if (this.matchesPatterns(text, ['account', 'my account', 'settings', 'preferences'])) {
      this.navigate('/account');
      return { success: true, message: 'Opening account' };
    }

    if (this.matchesPatterns(text, ['wishlist', 'my wishlist', 'view wishlist', 'show wishlist'])) {
      this.navigate('/wishlist');
      return { success: true, message: 'Opening wishlist' };
    }

    // Search commands
    const searchMatch = text.match(/(?:search for|find|look for|show me)\s+(.+)/i);
    if (searchMatch) {
      const query = searchMatch[1];
      return await this.searchProducts(query);
    }

    // Add to cart (including common speech recognition variations)
    if (this.matchesPatterns(text, [
      'add to cart', 'add this to cart', 'add product', 'add this product', 'put in cart',
      'add to bag', 'add this to bag', 'put in bag',
      'add to court', 'add this to court', // Common misrecognition of "cart"
      'add it to cart', 'add it to bag'
    ])) {
      return await this.addToCart();
    }

    // Cart actions with product name
    const addNamedMatch = text.match(/add\s+(.+?)\s+to\s+cart/i);
    if (addNamedMatch) {
      const productName = addNamedMatch[1];
      return await this.addToCartByName(productName);
    }

    // Wishlist
    if (this.matchesPatterns(text, ['add to wishlist', 'add this to wishlist', 'save to wishlist', 'wishlist this'])) {
      return await this.addToWishlist();
    }

    // Product details
    if (this.matchesPatterns(text, ['product details', 'tell me about this', 'what is this', 'describe this product', 'product information'])) {
      return await this.getProductDetails();
    }

    // Get price
    if (this.matchesPatterns(text, ['what is the price', 'how much', 'price', 'cost'])) {
      return await this.getPrice();
    }

    // Reviews
    if (this.matchesPatterns(text, ['reviews', 'show reviews', 'what are the reviews', 'read reviews'])) {
      return await this.getReviews();
    }

    // Stock check
    if (this.matchesPatterns(text, ['in stock', 'is this in stock', 'available', 'is this available'])) {
      return await this.checkStock();
    }

    // Filter/sort
    const priceMatch = text.match(/(?:show|find|get)\s+products?\s+(?:under|below|less than)\s+\$?(\d+)/i);
    if (priceMatch) {
      const maxPrice = parseInt(priceMatch[1]);
      return await this.filterByPrice(maxPrice);
    }

    if (this.matchesPatterns(text, ['show deals', 'deals', 'discounts', 'on sale', 'show sale items'])) {
      return await this.showDeals();
    }

    if (this.matchesPatterns(text, ['highest rated', 'best rated', 'top rated', 'sort by rating'])) {
      return await this.sortByRating();
    }

    // Checkout commands
    if (text.includes('place order') || text.includes('complete order') || text.includes('finish order')) {
      return await this.placeOrder();
    }

    // Address update (extract address from speech)
    const addressMatch = text.match(/(?:my address is|address is|shipping address)\s+(.+)/i);
    if (addressMatch) {
      const address = addressMatch[1];
      return await this.updateAddress(address);
    }

    const zipMatch = text.match(/(?:zip code|zip|postal code)\s+(\d{5})/i);
    if (zipMatch) {
      const zip = zipMatch[1];
      return await this.updateZip(zip);
    }

    // Help
    if (this.matchesPatterns(text, ['help', 'what can i say', 'commands', 'what can you do'])) {
      return this.showHelp();
    }

    return { success: false, message: "I didn't understand that command. Say 'help' for available commands." };
  }

  private matchesPatterns(text: string, patterns: string[]): boolean {
    return patterns.some(pattern => text.includes(pattern));
  }

  private async searchProducts(query: string): Promise<CommandResult> {
    try {
      const results = await productService.searchProducts(query);
      if (results.length === 0) {
        speechService.speak(`No products found for ${query}`);
        return { success: false, message: `No products found for "${query}"` };
      }
      this.navigate(`/s/${encodeURIComponent(query)}`);
      speechService.speak(`Found ${results.length} products for ${query}`);
      return { success: true, message: `Found ${results.length} products` };
    } catch (error) {
      console.error('Search error:', error);
      return { success: false, message: 'Search failed' };
    }
  }

  private async addToCart(): Promise<CommandResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        speechService.speak('Please log in first');
        return { success: false, message: 'Please log in first' };
      }

      // Get product ID from URL
      const match = this.location.pathname.match(/\/product\/([^/]+)/);
      if (!match) {
        speechService.speak('Please navigate to a product page first');
        return { success: false, message: 'Not on a product page' };
      }

      const productId = match[1];
      const { data: product } = await supabase
        .from('products')
        .select('name, price')
        .eq('id', productId)
        .single();

      if (!product) {
        return { success: false, message: 'Product not found' };
      }

      await useCartStore.getState().addItem(productId, 1);
      await useCartStore.getState().refreshCart();

      speechService.speak(`Added ${product.name} to cart`);
      this.toast({
        title: "Added to cart",
        description: product.name,
      });

      return { success: true, message: `Added ${product.name} to cart` };
    } catch (error: any) {
      console.error('Add to cart error:', error);
      return { success: false, message: 'Failed to add to cart' };
    }
  }

  private async addToCartByName(productName: string): Promise<CommandResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        speechService.speak('Please log in first');
        return { success: false, message: 'Please log in first' };
      }

      const { data: product } = await supabase
        .from('products')
        .select('id, name, price')
        .ilike('name', `%${productName}%`)
        .limit(1)
        .single();

      if (!product) {
        speechService.speak(`Product ${productName} not found`);
        return { success: false, message: 'Product not found' };
      }

      await useCartStore.getState().addItem(product.id, 1);
      await useCartStore.getState().refreshCart();

      speechService.speak(`Added ${product.name} to cart`);
      this.toast({
        title: "Added to cart",
        description: product.name,
      });

      return { success: true, message: `Added ${product.name} to cart` };
    } catch (error) {
      console.error('Add to cart error:', error);
      return { success: false, message: 'Failed to add to cart' };
    }
  }

  private async addToWishlist(): Promise<CommandResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        speechService.speak('Please log in first');
        return { success: false, message: 'Please log in first' };
      }

      const match = this.location.pathname.match(/\/product\/([^/]+)/);
      if (!match) {
        speechService.speak('Please navigate to a product page first');
        return { success: false, message: 'Not on a product page' };
      }

      const productId = match[1];
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
          speechService.speak('Already in wishlist');
          return { success: false, message: 'Already in wishlist' };
        }
        throw error;
      }

      speechService.speak(`Added ${product?.name} to wishlist`);
      this.toast({ title: "Added to wishlist", description: product?.name });
      return { success: true, message: 'Added to wishlist' };
    } catch (error) {
      console.error('Wishlist error:', error);
      return { success: false, message: 'Failed to add to wishlist' };
    }
  }

  private async getProductDetails(): Promise<CommandResult> {
    try {
      const match = this.location.pathname.match(/\/product\/([^/]+)/);
      if (!match) {
        speechService.speak('Please navigate to a product page first');
        return { success: false, message: 'Not on a product page' };
      }

      const productId = match[1];
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (!product) {
        return { success: false, message: 'Product not found' };
      }

      const description = `${product.name}. ${product.description}. Price: $${product.price}. Rating: ${product.rating} stars. ${product.in_stock ? 'In stock' : 'Out of stock'}.`;
      speechService.speak(description);

      return { success: true, message: 'Reading product details' };
    } catch (error) {
      console.error('Get product error:', error);
      return { success: false, message: 'Failed to get product details' };
    }
  }

  private async getPrice(): Promise<CommandResult> {
    try {
      const match = this.location.pathname.match(/\/product\/([^/]+)/);
      if (!match) {
        return { success: false, message: 'Not on a product page' };
      }

      const { data: product } = await supabase
        .from('products')
        .select('price, original_price')
        .eq('id', match[1])
        .single();

      if (!product) {
        return { success: false, message: 'Product not found' };
      }

      const priceText = product.original_price
        ? `The price is $${product.price}, discounted from $${product.original_price}`
        : `The price is $${product.price}`;

      speechService.speak(priceText);
      return { success: true, message: priceText };
    } catch (error) {
      return { success: false, message: 'Failed to get price' };
    }
  }

  private async getReviews(): Promise<CommandResult> {
    try {
      const match = this.location.pathname.match(/\/product\/([^/]+)/);
      if (!match) {
        return { success: false, message: 'Not on a product page' };
      }

      const { data: product } = await supabase
        .from('products')
        .select('rating, reviews')
        .eq('id', match[1])
        .single();

      if (!product) {
        return { success: false, message: 'Product not found' };
      }

      const reviewText = `This product has ${product.rating} stars with ${product.reviews} reviews`;
      speechService.speak(reviewText);
      return { success: true, message: reviewText };
    } catch (error) {
      return { success: false, message: 'Failed to get reviews' };
    }
  }

  private async checkStock(): Promise<CommandResult> {
    try {
      const match = this.location.pathname.match(/\/product\/([^/]+)/);
      if (!match) {
        return { success: false, message: 'Not on a product page' };
      }

      const { data: product } = await supabase
        .from('products')
        .select('in_stock, stock_quantity')
        .eq('id', match[1])
        .single();

      if (!product) {
        return { success: false, message: 'Product not found' };
      }

      const stockText = product.in_stock
        ? `Yes, this product is in stock. ${product.stock_quantity} units available`
        : 'Sorry, this product is out of stock';

      speechService.speak(stockText);
      return { success: true, message: stockText };
    } catch (error) {
      return { success: false, message: 'Failed to check stock' };
    }
  }

  private async filterByPrice(maxPrice: number): Promise<CommandResult> {
    try {
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .lte('price', maxPrice)
        .order('price', { ascending: true })
        .limit(20);

      if (!products || products.length === 0) {
        speechService.speak(`No products found under $${maxPrice}`);
        return { success: false, message: 'No products found' };
      }

      speechService.speak(`Found ${products.length} products under $${maxPrice}`);
      this.navigate(`/s/under-${maxPrice}`);
      return { success: true, message: `Found ${products.length} products` };
    } catch (error) {
      return { success: false, message: 'Failed to filter products' };
    }
  }

  private async showDeals(): Promise<CommandResult> {
    try {
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .not('original_price', 'is', null)
        .order('price', { ascending: true })
        .limit(20);

      if (!products || products.length === 0) {
        speechService.speak('No deals available right now');
        return { success: false, message: 'No deals found' };
      }

      speechService.speak(`Found ${products.length} deals`);
      this.navigate('/');
      return { success: true, message: `Found ${products.length} deals` };
    } catch (error) {
      return { success: false, message: 'Failed to get deals' };
    }
  }

  private async sortByRating(): Promise<CommandResult> {
    try {
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('rating', { ascending: false })
        .limit(20);

      if (!products || products.length === 0) {
        return { success: false, message: 'No products found' };
      }

      speechService.speak(`Showing ${products.length} top-rated products`);
      this.navigate('/');
      return { success: true, message: 'Showing top-rated products' };
    } catch (error) {
      return { success: false, message: 'Failed to sort products' };
    }
  }

  private async placeOrder(): Promise<CommandResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, message: 'Please log in first' };
      }

      // Check if on checkout page
      if (!this.location.pathname.includes('/checkout')) {
        this.navigate('/checkout');
        speechService.speak('Please complete the shipping form first');
        return { success: false, message: 'Navigate to checkout first' };
      }

      // Get checkout data
      const checkoutState = useCheckoutStore.getState();
      const { address, city, zipCode } = checkoutState;

      if (!address || !city || !zipCode) {
        speechService.speak('Please provide shipping address');
        return { success: false, message: 'Shipping address required' };
      }

      // Get cart items
      const { data: cartItems } = await supabase
        .from('cart')
        .select(`
          product_id,
          quantity,
          products (name, price)
        `)
        .eq('user_id', user.id);

      if (!cartItems || cartItems.length === 0) {
        speechService.speak('Your cart is empty');
        return { success: false, message: 'Cart is empty' };
      }

      const total = cartItems.reduce((sum: number, item: any) =>
        sum + (item.products.price * item.quantity), 0
      );

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total,
          address,
          city,
          zip: zipCode,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items
      const orderItems = cartItems.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products.price
      }));

      await supabase.from('order_items').insert(orderItems);

      // Clear cart
      await supabase.from('cart').delete().eq('user_id', user.id);

      speechService.speak('Order placed successfully');
      this.navigate(`/order-confirmation/${order.id}`);

      return { success: true, message: 'Order placed successfully' };
    } catch (error) {
      console.error('Place order error:', error);
      speechService.speak('Failed to place order');
      return { success: false, message: 'Failed to place order' };
    }
  }

  private async updateAddress(address: string): Promise<CommandResult> {
    useCheckoutStore.getState().setAddress(address);
    speechService.speak('Address updated');
    return { success: true, message: 'Address updated' };
  }

  private async updateZip(zip: string): Promise<CommandResult> {
    useCheckoutStore.getState().setZipCode(zip);
    
    // Try to lookup city
    try {
      const { data, error } = await supabase.functions.invoke('lookup-zip', {
        body: { zipCode: zip }
      });

      if (!error && data?.city) {
        useCheckoutStore.getState().setCity(data.city);
        speechService.speak(`ZIP code updated. City is ${data.city}`);
        return { success: true, message: `ZIP and city updated to ${data.city}` };
      }
    } catch (error) {
      console.error('ZIP lookup error:', error);
    }

    speechService.speak('ZIP code updated');
    return { success: true, message: 'ZIP code updated' };
  }

  private showHelp(): CommandResult {
    const helpText = `Available commands: Navigate with 'go home', 'open cart', 'checkout', 'orders', 'account', 'wishlist'. Search with 'search for headphones'. Product actions: 'add to cart', 'add to wishlist', 'product details', 'what is the price', 'reviews', 'in stock'. On checkout page: 'my address is 123 Main Street', 'zip code 10001', 'place order'.`;
    speechService.speak(helpText);
    return { success: true, message: 'Showing available commands' };
  }
}
