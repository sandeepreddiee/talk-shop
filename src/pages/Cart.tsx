import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { useVoiceStore } from '@/stores/useVoiceStore';
import { speechService } from '@/services/speechService';
import { productService } from '@/services/productService';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AssistantPanel } from '@/components/AssistantPanel';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem } = useCartStore();
  const { isAssistantOpen, setAssistantOpen } = useVoiceStore();
  
  const cartItems = items.map(item => ({
    ...item,
    product: productService.getProductById(item.productId)!
  })).filter(item => item.product);

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  useEffect(() => {
    if (items.length > 0) {
      speechService.speak(`Shopping cart. You have ${items.length} items. Total: $${total.toFixed(2)}. Say proceed to checkout when ready.`);
    }
  }, []);

  const handleCheckout = async () => {
    navigate('/checkout');
    await speechService.speak('Proceeding to checkout');
  };

  const handleRemove = async (productId: string, productName: string) => {
    removeItem(productId);
    await speechService.speak(`Removed ${productName} from cart`);
    toast.success('Item removed');
  };

  if (items.length === 0) {
    return (
      <main id="main-content" className="container py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <p className="mb-4">Your cart is empty</p>
        <Button onClick={() => navigate('/')}>Continue Shopping</Button>
      </main>
    );
  }

  return (
    <main id="main-content" className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart ({items.length} items)</h1>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.productId} className="flex gap-4 border p-4 rounded">
            <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-lg font-bold">${item.product.price}</p>
              <div className="flex gap-2 items-center mt-2">
                <Button size="sm" onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label="Decrease quantity">-</Button>
                <span aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
                <Button size="sm" onClick={() => updateQuantity(item.productId, item.quantity + 1)} aria-label="Increase quantity">+</Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => handleRemove(item.productId, item.product.name)}
                  aria-label={`Remove ${item.product.name}`}
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
        <Button size="lg" onClick={handleCheckout} className="w-full">
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
