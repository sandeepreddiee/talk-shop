import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const searchProducts = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        const results = await productService.searchProducts(query);
        setProducts(results);
        
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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
