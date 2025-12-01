import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { productService } from '@/services/database/productService';
import { ProductCard } from '@/components/ProductCard';
import { speechService } from '@/services/speechService';
import { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { activityService } from '@/services/activityService';

export default function Search() {
  const { query } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        const results = await productService.searchProducts(query);
        setProducts(results);
        setFocusedIndex(0);
        
        const count = results.length;
        const message = count === 1 
          ? '1 result loaded' 
          : `${count} results loaded`;
        speechService.speak(message);
        
        await activityService.logActivity('search', { query, resultCount: count });
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  // Circular Tab navigation through products only
  useEffect(() => {
    if (products.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle Tab when focused within product grid
      if (e.key === 'Tab') {
        e.preventDefault();
        
        if (e.shiftKey) {
          // Shift+Tab: Previous product (circular)
          setFocusedIndex(prev => {
            const newIndex = prev === 0 ? products.length - 1 : prev - 1;
            setTimeout(() => productRefs.current[newIndex]?.focus(), 0);
            return newIndex;
          });
        } else {
          // Tab: Next product (circular)
          setFocusedIndex(prev => {
            const newIndex = prev === products.length - 1 ? 0 : prev + 1;
            setTimeout(() => productRefs.current[newIndex]?.focus(), 0);
            return newIndex;
          });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [products.length]);

  // Focus first product on load
  useEffect(() => {
    if (products.length > 0 && !loading) {
      setTimeout(() => productRefs.current[0]?.focus(), 100);
    }
  }, [products.length, loading]);

  if (loading) {
    return (
      <main id="main-content" className="container py-8 px-4">
        <Skeleton className="h-8 w-96 mb-6" />
        <Skeleton className="h-4 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for &ldquo;{query}&rdquo;
      </h1>
      <p className="text-muted-foreground mb-6" aria-live="polite">
        {products.length} {products.length === 1 ? 'result' : 'results'} found
      </p>
      
      {products.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">
            No products found matching "{query}"
          </p>
          <p className="text-sm text-muted-foreground">
            Try different keywords or browse all products
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product}
              ref={(el) => (productRefs.current[index] = el)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
