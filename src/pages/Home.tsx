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
      <section aria-labelledby="featured-heading" className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--header-bg))] via-[hsl(var(--header-bg))] to-primary text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_60%)]" />
        
        <div className="container px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 animate-fade-in">
              <span className="text-sm font-medium">🎙️ Voice-Powered Shopping Experience</span>
            </div>
            
            <h1 id="featured-heading" className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Shopping Made <span className="text-accent bg-clip-text text-transparent bg-gradient-to-r from-accent to-white">Accessible</span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Experience the future of e-commerce with our voice-first platform designed for everyone
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center items-center mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium">100% Accessible</span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Voice Commands</span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">AI Powered</span>
              </div>
            </div>
            
            <p className="text-sm text-white/70 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Press <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">Ctrl+V</kbd> to start shopping with your voice
            </p>
          </div>
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
