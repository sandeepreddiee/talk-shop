import { Order } from '@/types';

const STORAGE_KEY = 'user_orders';

export const orderService = {
  getOrders: (): Order[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  createOrder: (order: Order): void => {
    const orders = orderService.getOrders();
    orders.unshift(order);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  },

  getOrderById: (orderId: string): Order | undefined => {
    return orderService.getOrders().find(o => o.id === orderId);
  }
};
