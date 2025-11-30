import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/useCartStore';
import { useCheckoutStore } from '@/stores/useCheckoutStore';
import { productService } from '@/services/database/productService';
import { orderService } from '@/services/database/orderService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { speechService } from '@/services/speechService';
import { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { activityService } from '@/services/activityService';
import { playSuccessSound, playErrorSound } from '@/components/AudioFeedback';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart, loadCart } = useCartStore();
  const { 
    address, 
    city, 
    zipCode, 
    setAddress, 
    setCity, 
    setZipCode,
    clearAddress 
  } = useCheckoutStore();
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address || !city || !zipCode) {
      toast.error('Please fill in all address fields');
      await speechService.speak('Please fill in all address fields');
      playErrorSound();
      return;
    }

    setIsProcessing(true);
    await speechService.speak('Processing your order');
    await activityService.logActivity('start_checkout', { itemCount: items.length, total });

    try {
      const orderItems = cartItems.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      }));

      const orderId = await orderService.createOrder(orderItems, address, city, zipCode);
      
      await clearCart();
      clearAddress();
      
      toast.success('Order placed successfully!');
      playSuccessSound();
      await speechService.speak(`Order placed successfully. Your order ID is ${orderId}`);
      await activityService.logActivity('complete_order', { orderId, total });
      
      navigate(`/order-confirmation/${orderId}`);
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
      playErrorSound();
      await speechService.speak('Order failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <main id="main-content" className="container py-8 px-4">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main id="main-content" className="container py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">Your cart is empty. Please add items before checking out.</p>
          <Button onClick={() => navigate('/')}>Start Shopping</Button>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St"
                  required
                  aria-required="true"
                />
              </div>
              
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                  required
                  aria-required="true"
                />
              </div>
              
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="10001"
                  required
                  aria-required="true"
                  pattern="[0-9]{5}"
                  title="Please enter a 5-digit ZIP code"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>{item.product.name} x {item.quantity}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
