import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types';

export const orderService = {
  createOrder: async (
    items: Array<{ productId: string; name: string; price: number; quantity: number; image: string }>,
    address: string,
    city: string,
    zip: string
  ): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total,
        address,
        city,
        zip,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError || !order) {
      throw new Error('Failed to create order');
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw new Error('Failed to create order items');
    }

    return order.id;
  },

  getOrders: async (): Promise<Order[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          price,
          products (
            id,
            name,
            image
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error || !orders) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return orders.map(order => ({
      id: order.id,
      date: new Date(order.created_at).toLocaleDateString(),
      total: Number(order.total),
      status: order.status as 'pending' | 'shipped' | 'delivered',
      items: order.order_items.map((item: any) => ({
        productId: item.products.id,
        name: item.products.name,
        price: Number(item.price),
        quantity: item.quantity,
        image: item.products.image
      })),
      shippingAddress: `${order.address}, ${order.city}, ${order.zip}`
    }));
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          price,
          products (
            id,
            name,
            image
          )
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !order) {
      return null;
    }

    return {
      id: order.id,
      date: new Date(order.created_at).toLocaleDateString(),
      total: Number(order.total),
      status: order.status as 'pending' | 'shipped' | 'delivered',
      items: order.order_items.map((item: any) => ({
        productId: item.products.id,
        name: item.products.name,
        price: Number(item.price),
        quantity: item.quantity,
        image: item.products.image
      })),
      shippingAddress: `${order.address}, ${order.city}, ${order.zip}`
    };
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<void> => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
    }
  }
};
