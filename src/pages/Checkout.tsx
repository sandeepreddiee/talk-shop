import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/useCartStore';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { speechService } from '@/services/speechService';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const cartItems = items.map(item => ({
    ...item,
    product: productService.getProductById(item.productId)!
  })).filter(item => item.product);

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address || !city || !zipCode) {
      toast.error('Please fill in all address fields');
      await speechService.speak('Please fill in all address fields');
      return;
    }

    setIsProcessing(true);
    await speechService.speak('Processing your order');

    // Simulate order processing
    setTimeout(() => {
      const orderId = 'ORD-' + Date.now();
      const order = {
        id: orderId,
        date: new Date().toISOString(),
        total,
        status: 'pending' as const,
        items: cartItems.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image
        })),
        shippingAddress: `${address}, ${city}, ${zipCode}`
      };

      orderService.createOrder(order);
      clearCart();
      
      toast.success('Order placed successfully!');
      speechService.speak(`Order placed successfully. Your order ID is ${orderId}`);
      navigate(`/order-confirmation/${orderId}`);
      setIsProcessing(false);
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <main id="main-content" className="container py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <p>Your cart is empty. Please add items before checking out.</p>
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
                <Label htmlFor="address">Street Address</Label>
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
                <Label htmlFor="city">City</Label>
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
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="10001"
                  required
                  aria-required="true"
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
