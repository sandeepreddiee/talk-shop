import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { useVoiceStore } from '@/stores/useVoiceStore';
import { speechService } from '@/services/speechService';
import { productService } from '@/services/database/productService';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AssistantPanel } from '@/components/AssistantPanel';
import { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { activityService } from '@/services/activityService';
import { playSuccessSound } from '@/components/AudioFeedback';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, loadCart } = useCartStore();
  const { isAssistantOpen, setAssistantOpen } = useVoiceStore();
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      await loadCart();
      setLoading(false);
    };
    loadData();
  }, [loadCart]);

  useEffect(() => {
    const loadProducts = async () => {
      const productMap: Record<string, Product> = {};
      for (const item of items) {
        if (!productMap[item.productId]) {
          const product = await productService.getProductById(item.productId);
          if (product) {
            productMap[item.productId] = product;
          }
        }
      }
      setProducts(productMap);
    };

    if (items.length > 0) {
      loadProducts();
    }
  }, [items]);

  const cartItems = items.map(item => ({
    ...item,
    product: products[item.productId]
  })).filter(item => item.product);

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  useEffect(() => {
    if (cartItems.length > 0 && !loading) {
      speechService.speak(`Shopping cart. You have ${items.length} items. Total: $${total.toFixed(2)}. Say proceed to checkout when ready.`);
      activityService.logActivity('view_cart', { itemCount: items.length, total });
    }
  }, [loading]);

  const handleCheckout = async () => {
    navigate('/checkout');
    await speechService.speak('Proceeding to checkout');
    await activityService.logActivity('proceed_to_checkout', { itemCount: items.length, total });
  };

  const handleRemove = async (productId: string, productName: string) => {
    try {
      await removeItem(productId);
      await speechService.speak(`Removed ${productName} from cart`);
      toast.success('Item removed');
      playSuccessSound();
      await activityService.logActivity('remove_from_cart', { productId, productName });
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      await updateQuantity(productId, newQuantity);
      playSuccessSound();
      await activityService.logActivity('update_cart_quantity', { productId, quantity: newQuantity });
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  if (loading) {
    return (
      <main id="main-content" className="container py-8 px-4">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main id="main-content" className="container py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Button onClick={() => navigate('/')}>Continue Shopping</Button>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart ({items.length} items)</h1>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.productId} className="flex gap-4 border p-4 rounded">
            <img 
              src={item.product.image} 
              alt={item.product.name} 
              className="w-24 h-24 object-cover rounded"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';
              }}
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-lg font-bold">${item.product.price}</p>
              <p className="text-sm text-muted-foreground">Subtotal: ${(item.product.price * item.quantity).toFixed(2)}</p>
              <div className="flex gap-2 items-center mt-2">
                <Button 
                  size="sm" 
                  onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)} 
                  aria-label="Decrease quantity"
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <span aria-label={`Quantity: ${item.quantity}`} className="min-w-[2rem] text-center">
                  {item.quantity}
                </span>
                <Button 
                  size="sm" 
                  onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)} 
                  aria-label="Increase quantity"
                >
                  +
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => handleRemove(item.productId, item.product.name)}
                  aria-label={`Remove ${item.product.name}`}
                  className="ml-auto"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 border-t pt-4">
        <div className="text-2xl font-bold mb-4">Total: ${total.toFixed(2)}</div>
        <Button 
          size="lg" 
          onClick={handleCheckout} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCheckout();
            }
          }}
          className="w-full"
          tabIndex={0}
          aria-label="Proceed to checkout"
        >
          Proceed to Checkout
        </Button>
        <div className="text-sm text-muted-foreground mt-4 space-y-1">
          <p><strong>Voice commands:</strong></p>
          <p>• "Proceed to checkout" - Continue to payment</p>
          <p>• "Remove item" - Remove current item</p>
          <p>• "Ask assistant" - Get shopping help</p>
        </div>
      </div>
      
      <AssistantPanel 
        isOpen={isAssistantOpen} 
        onClose={() => setAssistantOpen(false)}
        context={{
          page: 'cart',
          cartCount: items.length
        }}
      />
    </main>
  );
}
