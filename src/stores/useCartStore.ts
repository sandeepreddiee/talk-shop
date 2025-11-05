import { create } from 'zustand';
import { cartService } from '@/services/cartService';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  itemCount: number;
  addItem: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  loadCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: cartService.getCart(),
  itemCount: cartService.getItemCount(),

  addItem: (productId: string, quantity?: number) => {
    cartService.addToCart(productId, quantity);
    set({
      items: cartService.getCart(),
      itemCount: cartService.getItemCount()
    });
  },

  updateQuantity: (productId: string, quantity: number) => {
    cartService.updateQuantity(productId, quantity);
    set({
      items: cartService.getCart(),
      itemCount: cartService.getItemCount()
    });
  },

  removeItem: (productId: string) => {
    cartService.removeFromCart(productId);
    set({
      items: cartService.getCart(),
      itemCount: cartService.getItemCount()
    });
  },

  clearCart: () => {
    cartService.clearCart();
    set({ items: [], itemCount: 0 });
  },

  loadCart: () => {
    set({
      items: cartService.getCart(),
      itemCount: cartService.getItemCount()
    });
  }
}));
