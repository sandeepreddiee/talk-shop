import { productService } from '@/services/productService';
import { ProductCard } from '@/components/ProductCard';
import { speechService } from '@/services/speechService';

export default function Home() {
  const products = productService.getAllProducts();

  const handleQuickListen = async (product: any) => {
    await speechService.speak(`${product.name}. Price: $${product.price}. Rating: ${product.rating} stars.`);
  };

  return (
    <main id="main-content" className="container py-8 px-4">
      <section aria-labelledby="featured-heading" className="mb-12">
        <div className="bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-lg p-12 mb-8">
          <h1 id="featured-heading" className="text-4xl font-bold mb-4">Welcome to AccessShop</h1>
          <p className="text-xl">Voice-first shopping made accessible for everyone</p>
        </div>
      </section>

      <section aria-labelledby="products-heading">
        <h2 id="products-heading" className="text-2xl font-bold mb-6">All Products ({products.length} items)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
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
