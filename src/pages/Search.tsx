import { useParams } from 'react-router-dom';
import { productService } from '@/services/productService';
import { ProductCard } from '@/components/ProductCard';

export default function Search() {
  const { query } = useParams();
  const products = productService.searchProducts(query || '');

  return (
    <main id="main-content" className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for &ldquo;{query}&rdquo;
      </h1>
      <p className="text-muted-foreground mb-6" aria-live="polite">
        {products.length} results found
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
