import { create } from 'zustand';
import { cartService } from '@/services/database/cartService';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  itemCount: number;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  itemCount: 0,

  addItem: async (productId: string, quantity?: number) => {
    await cartService.addToCart(productId, quantity);
    await get().refreshCart();
  },

  updateQuantity: async (productId: string, quantity: number) => {
    await cartService.updateQuantity(productId, quantity);
    await get().refreshCart();
  },

  removeItem: async (productId: string) => {
    await cartService.removeFromCart(productId);
    await get().refreshCart();
  },

  clearCart: async () => {
    await cartService.clearCart();
    set({ items: [], itemCount: 0 });
  },

  loadCart: async () => {
    const items = await cartService.getCart();
    const itemCount = await cartService.getItemCount();
    set({ items, itemCount });
  },

  refreshCart: async () => {
    const items = await cartService.getCart();
    const itemCount = await cartService.getItemCount();
    set({ items, itemCount });
  }
}));
