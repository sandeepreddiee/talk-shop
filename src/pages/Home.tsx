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

  const categoryGroups = {
    'Electronics': products.filter(p => p.category === 'Electronics'),
    'Computing': products.filter(p => p.category === 'Computing'),
    'Gaming': products.filter(p => p.category === 'Gaming'),
    'Home & Kitchen': products.filter(p => p.category === 'Home & Kitchen'),
    'Fashion & Wearables': products.filter(p => p.category === 'Fashion & Wearables'),
  };

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <section aria-labelledby="featured-heading" className="bg-gradient-to-b from-[hsl(var(--header-bg))] to-background text-white py-8">
        <div className="container px-4">
          <h1 id="featured-heading" className="text-3xl md:text-4xl font-normal mb-2">Welcome to AccessShop</h1>
          <p className="text-lg text-gray-300">Voice-first shopping made accessible for everyone</p>
        </div>
      </section>

      {dealProducts.length > 0 && (
        <section aria-labelledby="deals-heading" className="bg-deals-bg py-8">
          <div className="container px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 id="deals-heading" className="text-2xl md:text-3xl font-bold text-white">Today's Deals</h2>
              <button className="text-sm text-white hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1">See more</button>
            </div>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-max">
                {dealProducts.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-64">
                    <ProductCard
                      product={product}
                      onQuickListen={() => handleQuickListen(product)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {Object.entries(categoryGroups).map(([category, categoryProducts]) => {
        if (categoryProducts.length === 0) return null;
        
        const categoryDeals = categoryProducts.filter(p => p.originalPrice && p.originalPrice > p.price);
        const displayProducts = categoryDeals.length > 0 ? categoryDeals : categoryProducts.slice(0, 8);
        
        if (displayProducts.length === 0) return null;

        return (
          <section key={category} aria-labelledby={`${category}-heading`} className="py-8 border-t border-border">
            <div className="container px-4">
              <div className="flex items-center justify-between mb-6">
                <h2 id={`${category}-heading`} className="text-2xl md:text-3xl font-bold text-foreground">
                  {categoryDeals.length > 0 ? `Deals on ${category}` : category}
                </h2>
                <button className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1">See more</button>
              </div>
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
                  {displayProducts.map((product) => (
                    <div key={product.id} className="flex-shrink-0 w-64">
                      <ProductCard
                        product={product}
                        onQuickListen={() => handleQuickListen(product)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}
