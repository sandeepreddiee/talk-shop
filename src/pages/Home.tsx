import { useEffect, useState } from 'react';
import { productService } from '@/services/database/productService';
import { ProductCard } from '@/components/ProductCard';
import { speechService } from '@/services/speechService';
import { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await productService.getAllProducts();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const handleQuickListen = async (product: any) => {
    await speechService.speak(`${product.name}. Price: $${product.price}. Rating: ${product.rating} stars.`);
  };

  if (loading) {
    return (
      <main id="main-content" className="container py-8 px-4">
        <section className="mb-12">
          <Skeleton className="h-48 w-full rounded-lg" />
        </section>
        <section>
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </section>
      </main>
    );
  }

  const dealProducts = products.filter(p => p.originalPrice && p.originalPrice > p.price);
  const regularProducts = products.filter(p => !p.originalPrice || p.originalPrice <= p.price);

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <section aria-labelledby="featured-heading" className="bg-gradient-to-b from-[hsl(var(--header-bg))] to-background text-white py-8">
        <div className="container px-4">
          <h1 id="featured-heading" className="text-3xl md:text-4xl font-normal mb-2">Welcome to AccessShop</h1>
          <p className="text-lg text-gray-300">Voice-first shopping made accessible for everyone</p>
        </div>
      </section>

      {dealProducts.length > 0 && (
        <section aria-labelledby="deals-heading" className="container px-4 py-8">
          <h2 id="deals-heading" className="text-2xl font-normal mb-6 text-foreground">Today's Deals</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {dealProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickListen={() => handleQuickListen(product)}
              />
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="products-heading" className="container px-4 py-8">
        <h2 id="products-heading" className="text-2xl font-normal mb-6 text-foreground">All Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {regularProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickListen={() => handleQuickListen(product)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
