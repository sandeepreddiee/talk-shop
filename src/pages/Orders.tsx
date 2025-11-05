import { Link } from 'react-router-dom';
import { orderService } from '@/services/orderService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Orders() {
  const orders = orderService.getOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500';
      case 'shipped':
        return 'bg-blue-500';
      default:
        return 'bg-yellow-500';
    }
  };

  if (orders.length === 0) {
    return (
      <main id="main-content" className="container py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
            <Button asChild>
              <Link to="/">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main id="main-content" className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      <p className="text-muted-foreground mb-6" aria-live="polite">
        {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
      </p>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-semibold">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-bold text-lg">
                    Total: ${order.total.toFixed(2)}
                  </span>
                  <Button variant="outline" asChild>
                    <Link to={`/order-confirmation/${order.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
