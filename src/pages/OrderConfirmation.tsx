import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '@/services/orderService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { speechService } from '@/services/speechService';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const order = orderService.getOrderById(orderId || '');

  useEffect(() => {
    if (order) {
      speechService.speak(`Order confirmed. Your order number is ${order.id}. Total amount: $${order.total.toFixed(2)}. You will receive a confirmation email shortly.`);
    }
  }, [order]);

  if (!order) {
    return (
      <main id="main-content" className="container py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Order Not Found</h1>
        <p>The order you're looking for doesn't exist.</p>
      </main>
    );
  }

  return (
    <main id="main-content" className="container py-8 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" aria-hidden="true" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your order. Your order has been placed successfully.
        </p>

        <Card className="text-left mb-8">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Order Number:</span>
              <span>{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{new Date(order.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className="capitalize">{order.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Shipping Address:</span>
              <span>{order.shippingAddress}</span>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Items</h3>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link to="/orders">View All Orders</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
