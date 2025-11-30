import { create } from 'zustand';
import { wishlistService } from '@/services/database/wishlistService';

interface WishlistState {
  wishlist: Set<string>;
  isLoading: boolean;
  loadWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: new Set(),
  isLoading: false,

  loadWishlist: async () => {
    set({ isLoading: true });
    try {
      const wishlistIds = await wishlistService.getWishlist();
      set({ wishlist: new Set(wishlistIds), isLoading: false });
    } catch (error) {
      console.error('Error loading wishlist:', error);
      set({ isLoading: false });
    }
  },

  addToWishlist: async (productId: string) => {
    try {
      await wishlistService.addToWishlist(productId);
      const currentWishlist = get().wishlist;
      currentWishlist.add(productId);
      set({ wishlist: new Set(currentWishlist) });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  removeFromWishlist: async (productId: string) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      const currentWishlist = get().wishlist;
      currentWishlist.delete(productId);
      set({ wishlist: new Set(currentWishlist) });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  },

  isInWishlist: (productId: string) => {
    return get().wishlist.has(productId);
  }
}));
