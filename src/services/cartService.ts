import { CartItem } from '@/types';

const STORAGE_KEY = 'shopping_cart';

export const cartService = {
  getCart: (): CartItem[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  addToCart: (productId: string, quantity: number = 1): void => {
    const cart = cartService.getCart();
    const existing = cart.find(item => item.productId === productId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  },

  updateQuantity: (productId: string, quantity: number): void => {
    const cart = cartService.getCart();
    const item = cart.find(i => i.productId === productId);
    
    if (item) {
      item.quantity = Math.max(1, quantity);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }
  },

  removeFromCart: (productId: string): void => {
    const cart = cartService.getCart().filter(item => item.productId !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  },

  clearCart: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getItemCount: (): number => {
    return cartService.getCart().reduce((sum, item) => sum + item.quantity, 0);
  }
};
