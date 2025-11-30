import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { orderService } from '@/services/database/orderService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { speechService } from '@/services/speechService';
import { Order } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
      
      if (data) {
        speechService.speak(`Order confirmed. Order number ${orderId.slice(0, 8)}. Total: $${data.total}. Status: ${data.status}.`);
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  useRealtimeOrders(loadOrder);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-orange-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  if (loading) {
    return (
      <main id="main-content" className="container py-8 px-4 max-w-3xl mx-auto">
        <Skeleton className="h-12 w-full mb-8" />
        <Skeleton className="h-96 w-full" />
      </main>
    );
  }

  if (!order) {
    return (
      <main id="main-content" className="container py-8 px-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/orders">View All Orders</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="container py-8 px-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <div>
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-muted-foreground">Thank you for your purchase</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Placed on {order.date}
              </p>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p className="text-muted-foreground">{order.shippingAddress}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.productId} className="flex gap-4 border-b pb-3 last:border-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button asChild className="flex-1">
              <Link to="/orders">View All Orders</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
