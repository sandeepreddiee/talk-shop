import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { productService } from '@/services/database/productService';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, ShoppingCart } from 'lucide-react';
import { speechService } from '@/services/speechService';
import { activityService } from '@/services/activityService';

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, loadWishlist, removeFromWishlist } = useWishlistStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlistProducts = async () => {
      setLoading(true);
      try {
        await loadWishlist();
        const wishlistArray = Array.from(wishlist);
        
        if (wishlistArray.length === 0) {
          setProducts([]);
          setLoading(false);
          await speechService.speak('Your wishlist is empty. Browse products to add items.');
          return;
        }

        const productPromises = wishlistArray.map(id => productService.getProductById(id));
        const loadedProducts = await Promise.all(productPromises);
        const validProducts = loadedProducts.filter(p => p !== null) as Product[];
        
        setProducts(validProducts);
        await speechService.speak(`Wishlist page. You have ${validProducts.length} items in your wishlist.`);
        await activityService.logActivity('view_wishlist', { itemCount: validProducts.length });
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlistProducts();
  }, [wishlist.size]);

  if (loading) {
    return (
      <main id="main-content" className="container py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main id="main-content" className="container py-8 px-4">
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-6">
            Start adding products you love to your wishlist!
          </p>
          <Button onClick={() => navigate('/')}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Start Shopping
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="container py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <p className="text-muted-foreground">
          {products.length} {products.length === 1 ? 'item' : 'items'}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
